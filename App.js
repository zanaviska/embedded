import React, {useState, useReducer, Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TextInput,
  ScrollView,
  Button,
} from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';

const solve = (x1, x2, x3, x4, y) => {
  const size = 20;
  const equal = (a, b) => (
      a.a === b.a &&
      a.b === b.b &&
      a.c === b.c &&
      a.d === b.d
  )
  const fn = arg => arg.a* x1 + arg.b * x2 + arg.c * x3 + arg.d * x4;
  let population = [...new Array(size)].map(() => ({a: Math.round(2*y*Math.random() - y), b: Math.round(2*y*Math.random() - y), c: Math.round(2*y*Math.random() - y), d: Math.round(2*y*Math.random() - y)}));
  let it = 20;
  while(it++) {
      //console.log('\n', it)
      let sum = 0.0;
      for(const elem of population) {
          const value = fn(elem) - y;
          if(value === 0) return elem;
          elem.dif = elem.dif || value
          sum += Math.abs(1/value);
      }
      //console.log(population);
      const generation = [];
      let pos = undefined;
      let cnt = 0.0;
      for(let i = 0; i < size; i++) {
          let dadR = Math.random() * sum - Math.abs(1/population[0].dif);
          let momR = 0;
          let dad = population[0];
          let mom = 5;
          //console.log('!');
          for(let j = 1; dadR > 0 && j < size; j++) {
              dad = population[j];
              dadR -= Math.abs(1/dad.dif);
          }
          //console.log('@');
          do {
              momR = Math.random() * sum;
              //console.log(momR, sum);
              momR -= Math.abs(1/population[0].dif);
              mom = population[0];
              //console.log(momR);
              for(let j = 1; momR > 0 && j < size; j++) {
                  mom = population[j];
                  momR -= Math.abs(1/mom.dif);
              }
              //console.log(dad, mom);
          } while(equal(dad, mom));
          //console.log('$');
          let newElem = {};
          const rnd = Math.round(Math.random()*2+1);
          newElem.a = dad.a;
          newElem.b = (rnd > 0 ? dad.b : mom.b);
          newElem.c = (rnd > 1 ? dad.c : mom.c);
          newElem.d = mom.d;
          newElem.dif = fn(newElem) - y;
          cnt += Math.abs(newElem.dif);
          if(!pos || Math.abs(newElem.dif) > Math.abs(generation[pos].dif)) pos = i;
          generation.push(newElem);
      }
      if(cnt > sum) generation[pos] = {a: Math.round(2*y*Math.random() - y), b: Math.round(2*y*Math.random() - y), c: Math.round(2*y*Math.random() - y), d: Math.round(2*y*Math.random() - y)};
      population = generation;
  }    
}
export default class App extends Component {
  state = {
    x1: 0,
    x2: 0,
    x3: 0,
    x4: 0,
    y: 0,
    a: 0,
    b: 0,
    c: 0,
    d: 0,
    spinner: false
  }
  componentDidMount1() {
    setInterval(() => {
      this.setState({
        spinner: !this.state.spinner
      });
    }, 3000);
  }
  render() {
    return (
      <SafeAreaView style={styles.page}>
        <Spinner
          visible={this.state.spinner}
          textContent="Рахуємо..."
          textStyle={styles.spinnerTextStyle}
        />
        <ScrollView>
          <View style={styles.element}>
            <Text>x1 = </Text>
            <TextInput
              style={styles.textInput} 
              keyboardType="numeric"
              onChangeText={x1 => this.setState({x1: x1 | 0})}
            />
          </View>
          <View style={styles.element}>
            <Text>x2 = </Text>
            <TextInput
              style={styles.textInput} 
              keyboardType="numeric"
              onChangeText={x2 => this.setState({x2: x2 | 0})}
            />
          </View>
          <View style={styles.element}>
            <Text>x3 = </Text>
            <TextInput
              style={styles.textInput} 
              keyboardType="numeric"
              onChangeText={x3 => this.setState({x3: x3 | 0})}
            />
          </View>
          <View style={styles.element}>
            <Text>x4 = </Text>
            <TextInput
              style={styles.textInput} 
              keyboardType="numeric"
              onChangeText={x4 => this.setState({x4: x4 | 0})}
            />
          </View>
          <View style={styles.element}>
            <Text>y = </Text>
            <TextInput
              style={styles.textInput} 
              keyboardType="numeric"
              onChangeText={y => this.setState({y: y | 0})}
            />
          </View>
          <View style={{justifyContent: 'center', padding: 40, width: '100%', alignItems: 'center'}}><Text>Рівняння</Text></View>
          <View style={{justifyContent: 'center', width: '100%', alignItems: 'center'}}><Text>{this.state.x1} * a + {this.state.x2} * b + {this.state.x3} * c + {this.state.x4} * d = {this.state.y}</Text></View>
          <View style={{justifyContent: 'center', padding: 40, width: '100%', alignItems: 'center'}}>
            <Button 
              title={"Oбчислити"} 
              onPress={() => this.setState(
                {spinner: true}, 
                () => setTimeout(
                  () => this.setState(solve(this.state.x1, this.state.x2, this.state.x3, this.state.x4, this.state.y), () => this.setState({spinner: false})),
                  50
                )
                /*async () => console.log(
                  solve(this.state.x1, this.state.x2, this.state.x3, this.state.x4, this.state.y),
                  //() => this.setState({spinner: false}, () => console.log('aaaa'))
                )*/
              )}
            />
          </View>
          <View style={{justifyContent: 'center', padding: 40, width: '100%', alignItems: 'center'}}><Text>Result</Text></View>
          <Text>a = {this.state.a}</Text>
          <Text>b = {this.state.b}</Text>
          <Text>c = {this.state.c}</Text>
          <Text>d = {this.state.d}</Text>
        
        </ScrollView>
      </SafeAreaView>
    );
  }
}
  
  
  const styles = StyleSheet.create({
    page: {
      flex: 1,
      padding: 20
    },
    textInput: {
      borderBottomWidth: 1,
      borderBottomColor: 'black',
        paddingVertical: 0,
        width: '70%',
        //backgroundColor: 'yellow'
      },
      element: {
        flexDirection: 'row',
        padding: 5,
        alignItems: 'center',
      }
    });
    