import React from 'react';
import { StyleSheet, View, TextInput, Button, Text, Dimensions } from 'react-native';
import { LineChart } from "react-native-chart-kit";

const styles = StyleSheet.create({
  searchBar: {
    position: 'relative',
    display: 'flex',
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 5,
    paddingRight: 5,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%',
  },
  chart: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }, 
  App: {
    backgroundColor: 'rgb(25,25,25)',
  },
  h1: {
    color: '#fff',
    fontSize: 18
  },
  input: {
    marginTop: 10,
    marginBottom: 10,
    color: '#fff'
  }
});

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

  // search bar value
  onChangeText = (searchQuery) => {
    this.setState({searchQuery: searchQuery});
  }


  // weather data fetching
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
        console.log(error);
        this.setState({searchError: true, errorMessage: 'Fetching data failed!'});
      });
  }

  render() {
    let errorMessage = null;
    if(this.state.searchError == true) {
      errorMessage = (
        <Text className="error-message">
          {this.state.errorMessage}
        </Text>
      );
    }

    const screenWidth = ((Dimensions.get("window").width)*0.8);

    let chartTemperatures = null;
    // als er data beschikbaar is wordt deze getoond
    if(this.state.temperatures.length > 0) {
      chartTemperatures = (
        <View style={styles.chart}>
          <LineChart
            data={{
              labels: ["1", "2", "3", "4", "5"],
              datasets: [
                {
                  data: this.state.temperatures
                }
              ]
            }}
            width={screenWidth} // from react-native
            height={220}
            yAxisSuffix={" °C"}
            chartConfig={{
              backgroundColor: "#3E517A",
              decimalPlaces: 1, // optional, defaults to 2dp
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
        <View style={styles.App}>
          <View style={styles.searchBar}>
            <Text style={styles.h1} h1>Search the weather</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => this.onChangeText(text)}
              value={this.state.searchQuery}
              placeholder="type a city for it's weather forecast"
            />
            <Button 
              title="Search"
              onPress={() => this.searchWeather()}
            />
          </View>

          {errorMessage}
          {chartTemperatures}
      </View>
    );
  }
}