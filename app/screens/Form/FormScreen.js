import React, { Component } from 'react';
import { NetInfo, ScrollView, View, Button, Text, Image } from 'react-native';
import PropTypes from 'prop-types';

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import RNFetchBlob from 'react-native-fetch-blob';

import { MKSpinner } from 'react-native-material-kit';
import Toast from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Section from './components/Section';
import Question from './components/Question';
import SendDialog from './components/SendDialog';

import { makeQuestionWritable, makeSectionWritable, formatToQuestionAnswer } from '../../imports/helpers/Format';

import styles from './styles/FormScreenStyle';
import { server } from '../../config/server';
import { COLOR_PALETTE } from '../../config/theme';

const AddSurveyAnswer = graphql(
	gql`mutation AddSurveyAnswer($input: SurveyAnswerInput!){
			addSurveyAnswer(input: $input){
				id
				lastUpdate
				survey {
					id
					name
				}
			}
		}`,
	{
		name: 'AddSurveyAnswer'
	}
);

class FormScreen extends Component {
    constructor(props){
        super(props);
        let survey = this.props.navigation.state.params.survey;

        let rows = [];
        for(let i = 0; i < survey.sections.length; i++){
            let questions = [];
            for(let j = 0; j < survey.sections[i].questions.length; j++){
                questions.push(Object.assign(makeQuestionWritable(survey.sections[i].questions[j]), {isSection: false}));
            }
            questions.sort(this.sortByIndex);
            let section  = Object.assign(makeSectionWritable(survey.sections[i]), {isSection: true, questions: questions});
            rows.push(section);
        }

        for(let i = 0; i < survey.questions.length; i++){
            rows.push(rows.push(Object.assign(makeQuestionWritable(survey.questions[i]), {isSection: false})));
        }
        rows.sort(this.sortByIndex);

        let answers = [];
        let files = [];
        let globalIndexHangout = 0;
        let globalIndexNoHangout = 0;
        for(let i = 0; i < rows.length; i++){
            if(rows[i].isSection){
                for(let j = 0; j < rows[i].questions.length; j++){
                    answers.push({
                        id: rows[i].questions[j].id,
                        index: rows[i].questions[j].index,
                        sectionIndex: rows[i].index,
                        globalIndex: rows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                        hangout: rows[i].questions[j].hangout,
                        name: rows[i].questions[j].name,
                        type: rows[i].questions[j].type,
                        mandatory: rows[i].questions[j].mandatory,
                        answer: null,
                    });
                    if(rows[i].questions[j].type === 'QUESTION_FILE'){
                        files.push({
                            surveyId: survey.id,
                            questionId: rows[i].questions[j].id,
                            hangout: rows[i].hangout,
                            filename: null,
                            filetype: null,
                            fileformat: null,
                            filepath: null,
                        });
                    }                    
                }
            }
            else {
                answers.push({
                    id: rows[i].id,
                    index: rows[i].index,
                    sectionIndex: 0,
                    globalIndex: rows[i].hangout === false ? ++globalIndexNoHangout: ++globalIndexHangout,
                    hangout: rows[i].hangout,
                    name: rows[i].name,
                    type: rows[i].type,
                    mandatory: rows[i].mandatory,
                    answer: null,
                });
                if(rows[i].type === 'QUESTION_FILE'){
                    files.push({
                        surveyId: survey.id,
                        questionId: rows[i].id,
                        hangout: rows[i].hangout,
                        filename: null,
                        filetype: null,
                        fileformat: null,
                        filepath: null,
                    });
                }
            }
        }
        this.state = {
            showHangout: false,
            scrollEnabled: true,
            answers: answers,
            files: files,
            rows: rows,
            sendDialogVisible: false,
            realm: this.props.navigation.getParam('realm'),
            connected: true,
        };
    };

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = ({navigation}) => ({
        title: 'Répondre à un questionnaire',
        headerRight:
            <Icon
                style={{marginRight: 15,}}
                name={'check'} 
                size={30} 
                color={COLOR_PALETTE.white}
                onPress={() => navigation.state.params.showSendDialog()}
            />
    });

    componentDidMount = () => {
        this.props.navigation.setParams({
            showSendDialog: this.showSendDialog,
        });

        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'){
                this.setState({
                    connected: false,
                }, () => this.refs.toast.show('Appareil déconnecté, les résultats seront stockés et envoyés plus tard', 2000));        
            }
        });

        NetInfo.addEventListener('connectionChange', this.onConnectionChange);
    };

    componentWillUnmount = () => {
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange)
    };

    onConnectionChange = (connectionInfo) => {
        if(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'){
            this.setState({
                connected: false,
            }, () => this.refs.toast.show('Appareil déconnecté, les résultats seront stockés et envoyés plus tard', 2000));
        }
        else {
            this.setState({
                connected: true,
            }, () => this.refs.toast.show('Appareil connecté, les résultats seront envoyés normalement', 2000));
        }
    };

    showSendDialog = () => {
        for(let i = 0; i < this.state.answers.length; i++){
            if(this.state.answers[i].hangout === this.state.showHangout){
                if(this.state.answers[i].sectionIndex !== 0){
                    let section = this.props.navigation.state.params.survey.sections.find((element) => {
                        return(element.index === this.state.answers[i].sectionIndex && element.hangout === this.state.showHangout);
                    });
                    let question = section.questions.find((element) => {
                        return element.id === this.state.answers[i].id
                    });
                    if(!this.checkIfAnswered(question, this.state.answers[i].answer, this.state.answers[i].type) && this.state.answers[i].mandatory){
                        this.refs.toast.show(`Question : ${question.name} obligatoire`, 2000);
                        return;
                    };
                }
                else {
                    let question = this.props.navigation.state.params.survey.questions.find((element) => {
                        return element.id === this.state.answers[i].id
                    });
                    if(!this.checkIfAnswered(question, this.state.answers[i].answer, this.state.answers[i].type) && this.state.answers[i].mandatory){
                        this.refs.toast.show(`Question : ${question.name} obligatoire`, 2000);
                        return;
                    };
                }
            }
        }
        this.setState({
            sendDialogVisible: true,
        });
    };

    hideSendDialog = () => {
        this.setState({
            sendDialogVisible: false,
        });
    };

    onConfirm = () => {
        this.hideSendDialog();
        this.sendFiles();
        let answers = [];
        this.state.answers.forEach((answer) => {
            if(answer.hangout === this.state.showHangout) answers.push(formatToQuestionAnswer(answer))
        });

        if(this.state.connected){
            let input = {
                'surveyId': this.props.navigation.state.params.survey.id,
                'hangout': this.state.showHangout,
                'questionAnswers': answers,
            };
            this.props.AddSurveyAnswer({variables: {input}}).then(
                () => {
                    this.state.realm.write(() => {
                        this.state.realm.objects('survey').filtered('id = $0', this.props.navigation.state.params.survey.id)[0].sentAnswers++;
                    });
                    this.props.navigation.navigate('CongratsScreen', {
                        message: `Réponses envoyées`, key: this.props.navigation.state.key
                    });
                },
                () => {
                    this.state.realm.write(() => {
                        let questionAnswers = [];
                        for(let i = 0; i < answers.length; i++){
                            let questionAnswer = this.state.realm.create('questionAnswer', {
                                questionName: answers[i].questionName,
                                questionIndex: answers[i].questionIndex,
                                questionType: answers[i].questionType,
                                value: answers[i].value,
                                choice: answers[i].choice === null ? []: answers[i].choice,
                                rank: answers[i].rank === null ? []: answers[i].rank,
                                file: answers[i].file,
                                scale: answers[i].scale,
                                date: answers[i].date === null ? []: answers[i].date,          
                            });
                            questionAnswers.push(questionAnswer);
                        }
                        let surveyAnswer = this.state.realm.create('surveyAnswer', {
                            surveyId: this.props.navigation.state.params.survey.id,
                            hangout: this.state.showHangout,
                            questionAnswers: questionAnswers,                    
                        });
                        this.state.realm.objects('survey').filtered('id = $0', this.props.navigation.state.params.survey.id)[0].stockedAnswers++;
                    });
                    this.hideSendDialog();
                    this.props.navigation.navigate('CongratsScreen', {
                        message: `Impossible de joindre le serveur, stockage des résultats`, key: this.props.navigation.state.key
                    });
                }
            );
        }
        else {
            this.state.realm.write(() => {
                let questionAnswers = [];
                for(let i = 0; i < answers.length; i++){
                    let questionAnswer = this.state.realm.create('questionAnswer', {
                        questionName: answers[i].questionName,
                        questionIndex: answers[i].questionIndex,
                        questionType: answers[i].questionType,
                        value: answers[i].value,
                        choice: answers[i].choice === null ? []: answers[i].choice,
                        rank: answers[i].rank === null ? []: answers[i].rank,
                        file: answers[i].file === null ? []: answers[i].file,
                        scale: answers[i].scale,
                        date: answers[i].date === null ? []: answers[i].date,             
                    });
                    questionAnswers.push(questionAnswer);
                }
                let surveyAnswer = this.state.realm.create('surveyAnswer', {
                    surveyId: this.props.navigation.state.params.survey.id,
                    hangout: this.state.showHangout,
                    questionAnswers: questionAnswers,                    
                });
                this.state.realm.objects('survey').filtered('id = $0', this.props.navigation.state.params.survey.id)[0].stockedAnswers++;
            });
            this.hideSendDialog();
            this.props.navigation.navigate('CongratsScreen', {
                message: `Appareil déconnecté, stockage des résultats`, key: this.props.navigation.state.key
            });
        }
    };

    checkIfAnswered = (question, answer) => {
        switch(question.type){
            case 'QUESTION_VALUE':
                if(answer === null) return false;
                if(question.askFor === 'number' && isNaN(+answer)) return false;
                if(question.askFor === 'number') return true;
                return !!answer.length;
            case 'QUESTION_CHOICE':
                if(answer === null) return false;
                let numberChecked = 0;
                for(let i = 0; i < answer.length; i++) if(answer[i] === true) numberChecked++;
                if (numberChecked !== (+question.linesNumber * +question.numberOfAnswers)) return false;
                return true;
            case 'QUESTION_RANK':
                if(answer === null) return false;
                if(answer.length < question.numberOfValues) return false;
                return true;
            case 'QUESTION_FILE':
                if(question.commentary && (answer === null || answer === '')) return false;
                for(let i = 0; i < this.state.files.length; i++){
                    if(this.state.files[i].id === question.id){
                        if(this.state.files[i].filename === null) return false;
                    }
                }
                if(!question.commentary) return true;
                return !!answer.length;
            case 'QUESTION_SCALE':
                if(answer === null) return false;
                return true;
            case 'QUESTION_DATE':
                if(answer === null) return false;
                if(answer[0].length === 0) return false;
                if(question.dateInterval && answer[1].length === 0) return false;
                return true;
            default:
                return true;
        }
    };

    sendFiles = () => {
        for(let i = 0; i < this.state.files.length; i++){
            if(this.state.files[i].hangout === this.state.showHangout){
                if(this.state.files[i].filename !== null && this.state.files[i].filename !== ''){
                    if(this.state.connected){
                        RNFetchBlob.fs.readStream(this.state.files[i].filepath, 'base64', 2097150, 1000).then((ifstream) => {
                            ifstream.open();
                            ifstream.onData((chunk) => {
                                let formData = new FormData();
                                formData.append('file', chunk);
                                formData.append('filename', this.state.files[i].filename);
                                formData.append('surveyId', this.props.navigation.state.params.survey.id);
                                formData.append('hangout', this.state.files[i].hangout);
                                fetch(`http://${server.url}/${server.saveEndpoint}`, {
                                    method: `POST`,
                                    body: formData,
                                }).then(
                                    undefined,
                                    (error) => {
                                        this.state.realm.write(() => {
                                            let file = this.state.realm.create('file', {
                                                surveyId: this.state.files[i].surveyId,
                                                questionId: this.state.files[i].questionId,
                                                hangout: this.state.files[i].hangout,
                                                filename: this.state.files[i].filename,
                                                filetype: this.state.files[i].filetype,
                                                fileformat: this.state.files[i].fileformat,
                                                filepath: this.state.files[i].filepath,                    
                                            });
                                        });
                                    }
                                );
                            });
                            ifstream.onError((error) => {
                                this.state.realm.write(() => {
                                    let file = this.state.realm.create('file', {
                                        surveyId: this.state.files[i].surveyId,
                                        questionId: this.state.files[i].questionId,
                                        hangout: this.state.files[i].hangout,
                                        filename: this.state.files[i].filename,
                                        filetype: this.state.files[i].filetype,
                                        fileformat: this.state.files[i].fileformat,
                                        filepath: this.state.files[i].filepath,                    
                                    });
                                });
                            });
                        });                        
                    }
                    else {
                        this.state.realm.write(() => {
                            let file = this.state.realm.create('file', {
                                surveyId: this.state.files[i].surveyId,
                                questionId: this.state.files[i].questionId,
                                hangout: this.state.files[i].hangout,
                                filename: this.state.files[i].filename,
                                filetype: this.state.files[i].filetype,
                                fileformat: this.state.files[i].fileformat,
                                filepath: this.state.files[i].filepath,                    
                            });
                        });
                    }
                }
            }
        }
    };

    changeAnswer = (id, answer) => {
        let answers = this.state.answers.slice();
        for(let i = 0; i < answers.length; i++){
            if(answers[i].id === id){
                answers[i].answer = answer;
                break;
            }
        }
        this.setState({
            answers: answers,
        });
    };

    changeFile = (questionId, filename, filetype, fileformat, filepath) => {
        let files = this.state.files.slice();
        for(let i = 0; i < files.length; i++){
            if(files[i].questionId === questionId){
                files[i].filename = filename;
                files[i].filetype = filetype;
                files[i].fileformat = fileformat;
                files[i].filepath = filepath;
                break;
            }
        }
        let answers = this.state.answers.slice();
        for(let i = 0; i< answers.length; i++){
            if(answers[i].id === questionId){
                let answer = answers[i].answer === null ? [``, ``]: answers[i].answer.slice();
                answer[0] = filename;
                answers[i].answer = answer;
                break;
            }
        }
        this.setState({
            files: files,
            answers: answers,
        });
    };

    enableScrolling = (scrollEnabled) => {
        this.setState({scrollEnabled: scrollEnabled});
    };

    showToast = (message) => {
        this.refs.toast.show(message, 2000); 
    };

    sortByIndex = (rowA, rowB) => {
        return(rowA.index - rowB.index);
    };

    render = () => {
        let survey = this.props.navigation.state.params.survey;

        let image = survey.image === '' ? null:
            <View style={styles.imageWrapper}>
                <Image
                    style={styles.image}
                    resizeMode='contain'
                    source={{uri: survey.image}}
                />
            </View>;
        
        let globalIndex = 0;
        let displayRows = [];
        for(let i = 0; i < this.state.rows.length; i++){
            if(this.state.rows[i].hangout === this.state.showHangout){
                if(this.state.rows[i].isSection){
                    displayRows.push(
                        <Section
                            key={i}
                            section={this.state.rows[i]}
                            globalIndex={globalIndex}
                            enableScrolling={this.enableScrolling}
                            changeAnswer={this.changeAnswer}
                            changeFile={this.changeFile}
                            showToast={this.showToast}
                        />
                    );
                    globalIndex += this.state.rows[i].questions.length;
                }
                else {
                    displayRows.push(
                        <Question
                            key={i}
                            question={this.state.rows[i]}
                            globalIndex={++globalIndex}
                            enableScrolling={this.enableScrolling}
                            changeAnswer={this.changeAnswer}
                            changeFile={this.changeFile}
                            showToast={this.showToast}
                        />
                    );
                }
            }
        }

        let toggleHangoutDiv = !survey.hangout ? null:
            <View style={styles.buttonsWrapper}>
                <Button color={this.state.showHangout ? COLOR_PALETTE.primaryColor.P500: COLOR_PALETTE.black} title={'Répondre'} onPress={() => this.setState({showHangout: false})}/>
                <Button color={this.state.showHangout ? COLOR_PALETTE.black: COLOR_PALETTE.primaryColor.P500} title={'Ajouter une sortie'} onPress={() => this.setState({showHangout: true})}/>
            </View>;

        return(
            <View>
                <ScrollView scrollEnabled={this.state.scrollEnabled}>
                    <Text style={styles.title}>{survey.name}</Text>
                    <Text style={styles.description}>{survey.description}</Text>
                    {image}
                    {toggleHangoutDiv}
                    <Text style={styles.hint}>
                        {`Ce questionnaire ${this.state.showHangout ? 'de sortie': 'encadré'} est composé de ${globalIndex} question(s) : `}
                    </Text>
                    {displayRows}
                    <SendDialog
                        visible={this.state.sendDialogVisible}
                        hideSendDialog={this.hideSendDialog}
                        onConfirm={this.onConfirm}
                    />

                    <View style={styles.buttonsWrapper}>
                        <Button
                            color={COLOR_PALETTE.primaryColor.P500}
                            title={'Envoyer les réponses'}
                            onPress={() => this.showSendDialog()}
                        />
                    </View>
                </ScrollView>
                <Toast 
                    ref={'toast'}
                    position={'bottom'}
                    positionValue={150}
                    style={styles.toastContainer}
                    textStyle={styles.toastText}
                />
            </View>
        );
    };

} export default compose(AddSurveyAnswer)(FormScreen);