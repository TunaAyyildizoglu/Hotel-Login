import React, { Component, useState, useRef, useEffect } from 'react'
import UseToken from '../UseToken';
import { useIsMounted } from '../IsMounted';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter
} from "react-router-dom";


function HomePage() {

  const [detailProfile, setDetailProfile] = useState(null);
  const { token, setToken } = UseToken();

  const isMounted = useIsMounted();

  // sonsuz döngüyü engelliyor
  let count = 0;

  useEffect(() => {
    getData();

    async function getData() {
      await fetch('https://www.icibot.net/v2/api/app_me', {
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
          setDetailProfile(data);
        }
      });
    }
  }, [count]);

  return (
    <div>HomePage
      { detailProfile && 
        <div>
          <p> Name: {detailProfile.first_name} </p>
          <p> LastName: {detailProfile.last_name} </p>
          <p> points_earned: {detailProfile.loyalty_info.points_earned} </p>
        </div>
      }
      <button><Link to="/survey">Anketler</Link></button>
    </div>
  )
}

export default HomePage;