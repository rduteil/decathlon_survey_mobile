import React, { Component } from 'react';
import { View, Image, Text, Slider } from 'react-native';

import styles from '../styles/BodyQuestionScaleStyle';
import { COLOR_PALETTE } from '../../../config/theme';

class BodyQuestionScale extends Component {
    constructor(props){
        super(props);

        this.state = {
            answer: 0,
        }
    }

    onChange = (e) => {
        this.setState({
            answer: e.toFixed(2),
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    render(){
        let labels = [];
        for(let i = 0; i < 5; i++){
            labels.push(
                <View key={i} style={styles.labelWrapper}>
                    {this.props.labelsValues[i + 5] === '' ?  null:
                        <Image source={{uri: this.props.labelsValues[i + 5]}} style={styles.image} resizeMode={'contain'}/>
                    }
                    <Text style={styles.label}>{this.props.labelsValues[i]}</Text>
                </View>
            );
        }
        let labelsContainer = (
            <View style={styles.labelsContainer}>
                {labels}
            </View>
        );

        let tickContainer = null;
        if(this.props.graduation){
            let tickMarks = [];
            for(let i = this.props.scaleMin; i < this.props.scaleMax + 1; i++){
                tickMarks.push(
                    <View
                        key={i}
                        style={[
                            styles.tick, 
                            {
                                borderBottomColor: i > this.state.answer ? COLOR_PALETTE.gray: COLOR_PALETTE.primaryColor.P500,
                                borderLeftColor: i > this.state.answer ? COLOR_PALETTE.gray: COLOR_PALETTE.primaryColor.P500
                            }
                        ]}
                    >
                        <Text style={[
                            styles.tickLabel,
                            {
                                color: i > this.state.answer ? COLOR_PALETTE.gray: COLOR_PALETTE.primaryColor.P500
                            }
                        ]}>
                            {i}
                        </Text>
                    </View>
                );
            }
            tickContainer = (
                <View style={styles.tickContainer}>
                    {tickMarks}
                </View>
            );
        }

        let gradient = null;
        if(this.props.gradient){
            gradient = (
                <Image source={require(`../images/resized0.png`)} style={styles.gradient} resizeMode={'stretch'}/>
            );
        }

        return(
            <View style={styles.columnContainer}>
                {labelsContainer}
                {tickContainer}
                {gradient}
                <Slider
                    minimumValue={this.props.scaleMin}
                    maximumValue={this.props.scaleMax}
                    onValueChange={(e) => this.onChange(e)}
                    step={this.props.step}
                    style={styles.slider}
                    minimumTrackTintColor={COLOR_PALETTE.primaryColor.P300}
                    thumbTintColor={COLOR_PALETTE.primaryColor.P500}
                />
                {!this.props.selectedValue ? null:
                    <Text style={styles.selectedValue}>{`Valeur selectionnée : ${this.state.answer}`}</Text>
                }
            </View>
        );
    }
} export default BodyQuestionScale;