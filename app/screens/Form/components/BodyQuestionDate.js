import React, { Component } from 'react';
import { View } from 'react-native';
import DatePicker from 'react-native-datepicker';

import styles from '../styles/BodyQuestionDateStyle';

class BodyQuestionDate extends Component {
    constructor(props){
        super(props);

        this.state = {
            answer: ['', ''],
        };
    }

    onChange = (index, date) => {
        let answer = this.state.answer.slice();
        answer[index] = date;
        this.setState({
            answer: answer,
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    render(){
        let secondDate = null;
        if(this.props.dateInterval){
            secondDate = (
                <DatePicker
                    style={styles.secondDate}
                    mode={'datetime'}
                    date={this.state.answer[1]}
                    placeholder={'Choisissez une date...'}
                    format={'DD-MM-YYYY HH:mm'}
                    minDate={this.props.dateMin}
                    maxDate={this.props.dateMax}
                    onDateChange={(date) => this.onChange(1, date)}
                    customStyles={{
                        dateInput: styles.dateInput,
                    }}
                /> 
            );
        }
        return(
            <View style={styles.mainContainer}>
                <DatePicker
                    style={styles.firstDate}
                    mode={'datetime'}
                    date={this.state.answer[0]}
                    placeholder={'Choisissez une date...'}
                    format={'DD-MM-YYYY HH:mm'}
                    minDate={this.props.dateMin}
                    maxDate={this.props.dateMax}
                    onDateChange={(date) => this.onChange(0, date)}
                    customStyles={{
                        dateInput: styles.dateInput,
                    }}
                />
                {secondDate}
            </View>
        );
    }
} export default BodyQuestionDate;