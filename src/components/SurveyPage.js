import React, { Component, useState, useEffect } from 'react'
import UseToken from '../UseToken';
import { useIsMounted } from '../IsMounted';

function SurveyPage() {

    const { token, setToken } = UseToken();
    const [surveyList, setSurveyList] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [resultMessage, setResultMessage] = useState("");
    const [resultLink, setResultLink] = useState("");

    const isMounted = useIsMounted();

    const [allAnswers, setAllAnswers] = useState([]);

    // sonsuz döngüyü engelliyor
    let count = 0;

    useEffect(() => {
        getSurvey();

        async function getSurvey() {
            await fetch('https://www.icibot.net/v2/api/main_survey/24', {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Connection': 'keep-alive',
                    'Authorization': 'Bearer ' + token
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (isMounted.current) {
                    setSurveyList(data.survey_lines);

                    const values = [...allAnswers];
                    for (let index = 0; index < data.survey_lines.length; index++) {
                        const element = data.survey_lines[index];
                        values.push({
                            hotel_id: element.hotel_id,
                            survey_header_id: element.survey_header_id,
                            survey_line_id: element.id,
                            profile_id: 17201,
                            answer: "",
                            answer_numeric: null
                        });
                    }
                    setAllAnswers(values);
                }
            });
        }
    }, [count]);

    function sendAnswers(answers) {
        return fetch('https://www.icibot.net/v2/api/survey_answer', {
            method: 'POST',
            headers: {
                'Accept': '*/*',
                'Accept-Encoding': 'gzip, deflate, br',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: answers
        })
            .then(handleSendAnswersResponse)
            .then(data => {
                return data;
            });
    }

    function handleSendAnswersResponse(response) {
        return response.text().then(text => {
            const data = text && JSON.parse(text);
            if (!response.ok) {
                const error = (data && data.message) || response.statusText;
                return Promise.reject(error);
            }
            return data;
        });
    }

    const handleSendSubmit = async (event) => {
        event.preventDefault();

        if (allAnswers.find(e => e.answer_numeric === null)) {
            setErrorMessage("Fill all blank inputs.");
            return;
        }
        else {
            setErrorMessage("");
        }

        const answers = JSON.stringify({ "survey_answers": allAnswers });

        sendAnswers(answers)
            .then(
                data => {
                    if (data.survey_result >= 7) {
                        setResultMessage(data.survey_header.thanks_message_for_positive_reviews);
                        setResultLink(data.survey_header.positive_redirect_urls[0]);
                    }
                    else {
                        setResultMessage(data.survey_header.thanks_message_for_negative_reviews);
                    }
                },
                error => {
                    console.log("Error: " + error);
                }
            );
    };

    const handleAnswerChange = (index, event, answer, answer_numeric) => {
        allAnswers[index]["answer"] = answer;
        allAnswers[index]["answer_numeric"] = answer_numeric;
    };

    return (
        <div>
            {surveyList && !resultMessage &&
                <form onSubmit={handleSendSubmit}>
                    {surveyList.map((surveyLine, index) => (
                        <div key={index} style={{ border: "1px solid black", margin: "5px", padding: "5px" }}>
                            <p>{surveyLine.question}</p>

                            {surveyLine.question_type === 'boolean' &&
                                <div>
                                    <input type="radio" value="10" name={'booleanType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Evet", 10)} /> Evet
                                    <input type="radio" value="1" name={'booleanType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Hayır", 1)} /> Hayır
                                </div>
                            }

                            {surveyLine.question_type === 'nps' &&
                                <div>
                                    <input type="radio" value="1" name={'npsType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "1", 1)} /> 1
                                    <input type="radio" value="2" name={'npsType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "2", 2)} /> 2
                                    <input type="radio" value="3" name={'npsType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "3", 3)} /> 3
                                    <input type="radio" value="4" name={'npsType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "4", 4)} /> 4
                                    <input type="radio" value="5" name={'npsType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "5", 5)} /> 5
                                </div>
                            }

                            {surveyLine.question_type === 'smile' &&
                                <div>
                                    <input type="radio" value="10" name={'smileType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Çok Memnunum", 10)} /> Çok memnunum
                                    <input type="radio" value="8" name={'smileType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Memnunum", 8)} /> Memnunum
                                    <input type="radio" value="6" name={'smileType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Vasat", 6)} /> Vasat
                                    <input type="radio" value="4" name={'smileType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Memnun değilim", 4)} /> Memnun değilim
                                    <input type="radio" value="2" name={'smileType' + surveyLine.id} onChange={(event) => handleAnswerChange(index, event, "Hiç memnun değilim", 2)} /> Hiç memnun değilim
                                </div>
                            }
                        </div>
                    ))}

                    <p style={{ color: "red" }}>{errorMessage}</p>
                    <button>Gönder</button>
                </form>
            }

            {resultMessage &&
                <div>
                    <p>{resultMessage}</p>
                </div>
            }

            {resultLink &&
                <div>
                    <a href={resultLink}>Link</a>
                </div>
            }
        </div>
    )
}

export default SurveyPage;