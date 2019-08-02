import React, { Component } from 'react';
import { View, Text } from 'react-native';

import BodyQuestionValue from '../components/BodyQuestionValue';
import BodyQuestionChoice from '../components/BodyQuestionChoice';
import BodyQuestionRank from '../components/BodyQuestionRank';
import BodyQuestionFile from '../components/BodyQuestionFile';
import BodyQuestionScale from '../components/BodyQuestionScale';
import BodyQuestionDate from '../components/BodyQuestionDate';

import styles from '../styles/QuestionStyle';

class Question extends Component {
    render(){
        let questionBody = null;
        switch(this.props.question.type){
            case 'QUESTION_VALUE':
                questionBody = <BodyQuestionValue
                    id={this.props.question.id}
                    askFor={this.props.question.askFor}
                    changeAnswer={this.props.changeAnswer}
                />
                break;
            case 'QUESTION_CHOICE':
                questionBody = <BodyQuestionChoice
                    id={this.props.question.id}
                    name={this.props.question.name}
                    linesNumber={this.props.question.linesNumber}
                    columnsNumber={this.props.question.columnsNumber}
                    linesLabels={this.props.question.linesLabels}
                    columnsLabels={this.props.question.columnsLabels}
                    linesImages={this.props.question.linesImages}
                    columnsImages={this.props.question.columnsImages}
                    numberOfAnswers={this.props.question.numberOfAnswers}
                    changeAnswer={this.props.changeAnswer}
                />
                break;
            case 'QUESTION_RANK':
                questionBody = <BodyQuestionRank
                    id={this.props.question.id}
                    numberOfValues={this.props.question.numberOfValues}
                    valuesAsImages={this.props.question.valuesAsImages}
                    values={this.props.question.values}
                    topLabel={this.props.question.topLabel}
                    bottomLabel={this.props.question.bottomLabel}
                    enableScrolling={this.props.enableScrolling}
                    changeAnswer={this.props.changeAnswer}
                />
                break;
            case 'QUESTION_FILE':
                questionBody = <BodyQuestionFile
                    id={this.props.question.id}
                    fileTypes={this.props.question.fileTypes}
                    commentary={this.props.question.commentary}
                    changeAnswer={this.props.changeAnswer}
                    changeFile={this.props.changeFile}
                    showToast={this.props.showToast}
                />
                break;
            case 'QUESTION_SCALE':
                questionBody = <BodyQuestionScale
                    id={this.props.question.id}
                    scaleMin={this.props.question.scaleMin}
                    scaleMax={this.props.question.scaleMax}
                    step={this.props.question.step}
                    labelsValues={this.props.question.labelsValues}
                    selectedValue={this.props.question.selectedValue}
                    graduation={this.props.question.graduation}
                    gradient={this.props.question.gradient}
                    gradientType={this.props.question.gradientType}
                    changeAnswer={this.props.changeAnswer}
                />
                break;
            case 'QUESTION_DATE':
                questionBody = <BodyQuestionDate
                    id={this.props.question.id}
                    dateInterval={this.props.question.dateInterval}
                    dateMin={this.props.question.dateMin}
                    dateMax={this.props.question.dateMax}
                    changeAnswer={this.props.changeAnswer}
                />
                break;
            default:
                break;
        }
        return(
            <View style={styles.mainContainer}>
                <View style={styles.rowContainer}>
                    <Text style={styles.indexText}>
                        {`Question ${this.props.globalIndex}`}
                    </Text>
                    <Text style={styles.mandatoryText}>
                        {this.props.question.mandatory ? '* Obligatoire': null}
                    </Text>
                </View>
                <Text style={styles.nameText}>
                    {this.props.question.name}
                </Text>
                <Text style={styles.descriptionText}>
                    {this.props.question.description}
                </Text>
                {questionBody}
            </View>
        );
    }
} export default Question;