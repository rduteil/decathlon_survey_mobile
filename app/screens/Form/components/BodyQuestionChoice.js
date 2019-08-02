import React, { Component } from 'react';
import { View, Text, Image, Dimensions, ScrollView, TouchableWithoutFeedback } from 'react-native';

import FuckinCheckbox from '../../../imports/components/FuckinCheckbox';
import FuckinRadioButton from '../../../imports/components/FuckinRadioButton';
import ChoiceDialog from '../components/bodyQuestionChoice/ChoiceDialog';
import styles from '../styles/BodyQuestionChoiceStyle';

import { COLOR_PALETTE } from '../../../config/theme';

class BodyQuestionChoice extends Component {
    constructor(props){
        super(props);

        let checkedCases = [];
        let answer = [];
        let visibility = [];

        for(let i = 0; i < this.props.linesNumber; i++){
            let checkedLines = [];
            for(let j = 0; j < this.props.columnsNumber; j++){
                checkedLines.push(false);
                answer.push(false);
            }
            checkedCases.push(checkedLines);
            visibility.push(false);
        }

        this.state = {
            checked: checkedCases,
            answer: answer,
            visibility: visibility,
        }
    }

    onChange = (isRadioButton, line, column) => {
        let checkedComponents = this.state.checked.slice();
        let answer = this.state.answer.slice();

        if(isRadioButton){
            if(checkedComponents[line][column] === true) return;
            for(let i = 0; i < this.props.columnsNumber; i++){
                checkedComponents[line][i] = false;
                answer[Number(line) * Number(this.props.columnsNumber) + Number(column)] = false;
            }
            checkedComponents[line][column] = true;
            answer[Number(line) * Number(this.props.columnsNumber) + Number(column)] = true;

        }
        else {
            if(checkedComponents[line][column] === true){
                checkedComponents[line][column] = false;
                answer[Number(line) * Number(this.props.columnsNumber) + Number(column)] = false;
            }
            else {
                let alreadyChecked = 0;
                for(let i = 0; i < this.props.columnsNumber; i++){
                    if(checkedComponents[line][i] === true) alreadyChecked++;
                }
                if(alreadyChecked < this.props.numberOfAnswers){
                    checkedComponents[line][column] = true;
                    answer[Number(line) * Number(this.props.columnsNumber) + Number(column)] = true;
                }
            }
        }
        this.setState({
            checked: checkedComponents,
            answer: answer,
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    createButton = (line, column) => {
        if(this.props.numberOfAnswers === 1){
            return(
                <FuckinRadioButton
                    checked={this.state.checked[line][column]}
                    line={line}
                    column={column}
                    onChange={this.onChange}
                />
            );
        }
        else {
            return(
                <FuckinCheckbox
                    checked={this.state.checked[line][column]}
                    line={line}
                    column={column}
                    onChange={this.onChange}
                />
            );
        }
    };

    createSingleLine = () => {
        let components = [];
        for(let i = 0; i < this.props.columnsNumber; i++){
            components.push(
                <View key={i} style={styles.rowContainer}>
                    {this.createButton(0, i)}
                    {this.props.columnsImages[i] === '' ? null:
                        <Image source={{uri: this.props.columnsImages[i]}} style={styles.image} resizeMode={'contain'}/>
                    }
                    <Text style={styles.text}>
                        {this.props.columnsLabels[i]}
                    </Text>
                </View>
            );
        }
        return(
            <View style={styles.columnContainer}>
                {components}
            </View>
        );
    };

    createDialog = () => {
        let components = [];
        for(let i = 0; i < this.props.linesNumber; i++){
            let answerView = [];
            for(let j = 0; j < this.props.columnsNumber; j++){
                if(this.state.checked[i][j]){
                    answerView.push(
                        <View key={j} style={styles.rowContainer}>
                            {this.props.columnsImages[j] === '' ? null:
                                <Image source={{uri: this.props.columnsImages[j]}} style={styles.image} resizeMode={'contain'}/>
                            }
                            <Text style={styles.text}>
                                {this.props.columnsLabels[j]}
                            </Text>
                        </View>
                    );
                }
            }
            if(answerView.length === 0){
                answerView = (
                    <View style={styles.rowContainer}>
                        <Text style={styles.placeholder}>
                            {this.props.numberOfAnswers === 1 ? 
                                `Choisissez une réponse...`:
                                `Choissisez jusqu'a ${this.props.numberOfAnswers} réponses...`
                            }
                        </Text>
                    </View>
                );
            }
            components.push(
                <View key={i} style={styles.columnContainer}>
                    <View style={styles.rowContainer}>
                        {this.props.linesImages[i] === '' ? null:
                            <Image source={{uri: this.props.linesImages[i]}} style={styles.image} resizeMode={'contain'}/>
                        }
                        <Text style={styles.text}>
                            {this.props.linesLabels[i]}
                        </Text>
                    </View>
                    <TouchableWithoutFeedback onPress={() => this.updateVisibility(i)}>
                        <View style={styles.answerWrapper}>
                            {answerView}
                        </View>
                    </TouchableWithoutFeedback>
                    <ChoiceDialog
                    image={this.props.linesImages[i]}
                        title={this.props.name}
                        subtitle={this.props.linesLabels[i]}
                        checked={this.state.checked}
                        onChange={this.onChange}
                        line={i}
                        visible={this.state.visibility[i]}
                        updateVisibility={this.updateVisibility}
                        numberOfAnswers={this.props.numberOfAnswers}
                        columnsNumber={this.props.columnsNumber}
                        columnsLabels={this.props.columnsLabels}
                        columnsImages={this.props.columnsImages}
                    />
                </View>
            );
        }
        return(
            <View style={styles.columnContainer}>
                {components}
            </View>
        );
    };

    createTable = () => {
        let table = [];

        let header = [
            <View key={-1} style={styles.tableCell}>
                <Text style={styles.hint}>
                    {this.props.numberOfAnswers === 1 ?
                        `Choisissez une réponse par ligne`:
                        `Choisissez jusqu'à ${this.props.numberOfAnswers} réponses par ligne`
                    }
                </Text>
            </View>,
        ];
        for(let i = 0; i < this.props.columnsNumber; i++){
            header.push(
                <View key={i} style={styles.tableCell}>
                    {this.props.columnsImages[i] === '' ? null:
                        <Image source={{uri: this.props.columnsImages[i]}} style={styles.image} resizeMode={'contain'}/>
                    }
                    <Text>
                        {`${this.props.columnsLabels[i]}`}
                    </Text>
                </View>
            );
        }
        table.push(
            <View key={-1} style={styles.tableRow}>
                {header}
            </View>
        );

        for(let i = 0; i < this.props.linesNumber; i++){
            let row = [
                <View key={-1} style={styles.tableCell}>
                    {this.props.linesImages[i] === '' ? null:
                        <Image source={{uri: this.props.linesImages[i]}} style={styles.image} resizeMode={'contain'}/>
                    }
                    <Text>
                        {`${this.props.linesLabels[i]}`}
                    </Text>
                </View>,
            ];
            for(let j = 0; j < this.props.columnsNumber; j++){
                row.push(
                    <View key={i} style={styles.tableCell}>
                        {this.createButton(i, j)}
                    </View>
                );
            }
            table.push(
                <View key={i} style={styles.tableRow}>
                    {row}
                </View>
            );
        }

        return(
            <View style={styles.table}>
                    {table}
            </View>
        );
    }

    updateVisibility = (line) => {
        this.setState((previousState) => {
            let visibility = previousState.visibility.slice();
            visibility[line] = !previousState.visibility[line];
            return({
                visibility: visibility,
            });
        });
    }

    render(){
        if(this.props.linesNumber === 1){
            return(this.createSingleLine());
        }
        else if(Dimensions.get('window').width < (this.props.columnsNumber + 1) * 175){
            return (this.createDialog());
        }
        else {
            return(this.createTable());
        }

        return null;
    }

} export default BodyQuestionChoice;