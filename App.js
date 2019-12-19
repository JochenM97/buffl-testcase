import React, { useCallback } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import './App.css';
import {
  LineChart, Dimensions
} from "react-native-chart-kit";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
      weatherData: [],
      searchError: false,
      errorMessage: '',
      temperatures: []
    }
  }

  onChangeText = (searchQuery) => {
    this.setState({searchQuery: searchQuery});
  }

  searchWeather = () => {
    //const api_key = 'a81adc80c1edf7dca92cf21d5c6efcbb';
    const api_key = "410463b3935acea56c8171825dbb4440"; // tijdelijke key want mijn eigen key was nog niet geactiveerd
    const url = 'http://api.openweathermap.org/data/2.5/forecast/daily?q=' + this.state.searchQuery + '&cnt=5' + '&APPID=' + api_key;
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        this.setState({searchError: false});
        
        if(response.cod !== "200") {
          this.setState({searchError: true, errorMessage: 'Please enter a valid city!'});
        }
        else {
          const cityTemperatures = [];
          response.list.forEach(weekday => {
            cityTemperatures.push(Math.round(weekday.temp.day - 273));
          });
          this.setState({temperatures: cityTemperatures});
        }
      })
      .catch((error) => {
        this.setState({searchError: true, errorMessage: 'Fetching data failed!'});
        console.log(error)
      });
  }

  render() {
    let errorMessage = null;
    if(this.state.searchError == true) {
      errorMessage = (
        <Text>
          {this.state.errorMessage}
        </Text>
      );
    }

    let temperatures = null;
    let chartTemperatures = null;

    if(this.state.temperatures.length > 0) {
      chartTemperatures = (
        <View>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [
                {
                  data: this.state.temperatures
                }
              ]
            }}
            width={400} // from react-native
            height={220}
            yAxisLabel={"T "}
            yAxisSuffix={" °C"}
            chartConfig={{
              backgroundColor: "#e26a00",
              backgroundGradientFrom: "#fb8c00",
              backgroundGradientTo: "#ffa726",
              decimalPlaces: 2, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </View>
      );
    }


    return (
        <View>
          <div className="search-bar">
            <TextInput
              className="search-input"
              onChangeText={(e) => this.onChangeText(event.target.value)}
              value={this.state.searchQuery}
              placeholder="Search a city for it's weather forecast"
            />
            <Button 
              className="search-button"
              title="Search"
              onPress={() => this.searchWeather()}
            />
          </div>
          {errorMessage}
          {chartTemperatures}
      </View>
    );
  }
}