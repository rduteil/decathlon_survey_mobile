import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';

import Question from '../components/Question';

import styles from '../styles/SectionStyle';

class Section extends Component {
    render = () => {
        let globalIndex = this.props.globalIndex;
        let questions = [];
        for(let i = 0; i < this.props.section.questions.length; i++){
            questions.push(
                <Question
                    key={i}
                    question={this.props.section.questions[i]}
                    globalIndex={++globalIndex}
                    enableScrolling={this.props.enableScrolling}
                    changeAnswer={this.props.changeAnswer}
                    changeFile={this.props.changeFile}
                    showToast={this.props.showToast}
                />
            );
        }

        let image = this.props.section.image === '' ? null:
        <View style={styles.imageWrapper}>
            <Image
                style={styles.image}
                resizeMode={`contain`}
                source={{uri: this.props.section.image}}
            />
        </View>;

        return(
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.nameText}>
                        {this.props.section.name}
                    </Text>
                </View>
                <Text style={styles.descriptionText}>
                    {this.props.section.description}
                </Text>
                {image}
                {questions}
            </View>
        );
    };
} export default Section;