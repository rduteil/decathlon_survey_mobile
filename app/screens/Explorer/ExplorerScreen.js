import React from 'react';
import { StatusBar, Text, View, ScrollView, NetInfo } from 'react-native';
import PropTypes from 'prop-types';

import moment from 'moment';
require('moment/locale/fr');

import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import Realm from 'realm';
import RNFetchBlob from 'react-native-fetch-blob';

import { MKSpinner } from 'react-native-material-kit';
import Toast from 'react-native-easy-toast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionButton from 'react-native-action-button';

import SurveyCard from './components/SurveyCard';
import DownloadDialog from './components/DownloadDialog';
import FilterDialog from './components/FilterDialog';
import SortDialog from './components/SortDialog';
import ActivationKeyDialog from './components/ActivationKeyDialog';

import styles from './styles/ExplorerScreenStyle';
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

const SurveySchema = {
    name: 'survey', 
    properties: {
        id: 'int',
        name: 'string',
        link: 'string',
        image: 'string?',
        description: 'string?',
        hangout: 'bool',
        activationDate: 'string',
        deactivationDate: 'string',
        activationKey: 'string?',
        language: 'string',
        lastUpdate: 'string',
        sections: {type: 'list', objectType: 'section'},
        questions: {type: 'list', objectType: 'question'},
        stockedAnswers: 'int?',
        sentAnswers: 'int?',
    }
};

const SectionSchema = {
    name: 'section',
    properties: {
        id: 'int',
        name: 'string',
        index: 'int',
        image: 'string?',
        description: 'string?',
        hangout: 'bool',
        questions: {type: 'list', objectType: 'question'},
    }
};

const QuestionSchema = {
    name: 'question',
    properties: {
        id: 'int',
        name: 'string',
        index: 'int',
        description: 'string?',
        mandatory: 'bool',
        type: 'string',
        hangout: 'bool',
        askFor: 'string?',
        linesNumber: 'int?',
        columnsNumber: 'int?',
        linesLabels: 'string?[]',
        columnsLabels: 'string?[]',
        linesImages: 'string?[]',
        columnsImages: 'string?[]',
        numberOfAnswers: 'int?',
        valuesAsImages: 'bool?',
        numberOfValues: 'int?',
        values: 'string?[]',
        topLabel: 'string?',
        bottomLabel: 'string?',
        fileTypes: 'bool?[]',
        commentary: 'bool?',
        scaleMin: 'int?',
        scaleMax: 'int?',
        step: 'float?',
        labelsValues: 'string?[]',
        selectedValue: 'bool?',
        graduation: 'bool?',
        gradient: 'bool?',
        gradientType: 'int?',
        dateInterval: 'bool?',
        dateMin: 'string?',
        dateMax: 'string?',
    }
};

const SurveyAnswerSchema = {
    name: 'surveyAnswer',
    properties: {
        surveyId: 'int',
        hangout: 'bool',
        questionAnswers: {type: 'list', objectType: 'questionAnswer'},
    },
};

const QuestionAnswerSchema = {
    name: 'questionAnswer',
    properties: {
        questionName: 'string',
        questionIndex: 'int',
        questionType: 'string',
        value: 'string?',
        choice: 'bool?[]',
        rank: 'string?[]',
        file: 'string?[]',
        scale: 'float?',
        date: 'string?[]',
    },
};

const FileSchema = {
    name: 'file',
    properties: {
        surveyId: 'int',
        questionId: 'int',
        hangout: 'bool',
        filename: 'string',
        filetype: 'string',
        fileformat: 'string',
        filepath: 'string',
    },
};

class ExplorerScreen extends React.Component {
    constructor(props){
        super(props);
        StatusBar.setBackgroundColor(COLOR_PALETTE.primaryColor.P800);

        this.state = {
            realm: null,
            showDownloadDialog: false,
            showFilterDialog: false,
            showSortDialog: false,
            showActivationKeyDialog: false,
            connected: true,
            surveyToCheck: null,
            filters: {
                active: false,
                hangout: [false, false],
                answer: [false, false],
                name: '',
            },
            formerFilters: {
                active: false,
                hangout: [false, false],
                answer: [false, false],
                name: '',
            },
            sort: {
                by: 'name',
                reversed: 1,
            },
        };
    }

    static propTypes = {
        navigation: PropTypes.object.isRequired,
    };

    static navigationOptions = {
        title: 'DECATHLON Survey'
    };

    componentDidMount = () => {
        NetInfo.getConnectionInfo().then((connectionInfo) => {
            if(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'){
                this.setState({
                    connected: false,
                }, () => this.refs.toast.show('Appareil déconnecté, impossible de télécharger ou mettre à jour un questionnaire', 2000));        
            }
        });

        NetInfo.addEventListener('connectionChange', this.onConnectionChange);

        Realm.open({schema: [SurveySchema, SectionSchema, QuestionSchema, SurveyAnswerSchema, QuestionAnswerSchema, FileSchema]}).then(realm => {
            this.setState({
                realm,
            });
            realm.addListener('change', () => {
                this.forceUpdate();
            });
        });
    };

    componentWillUnmount = () => {
        NetInfo.removeEventListener('connectionChange', this.onConnectionChange);
        this.state.realm.removeListener('change');
    };

    onConnectionChange = (connectionInfo) => {
        if(connectionInfo.type === 'none' || connectionInfo.type === 'unknown'){
            this.setState({
                connected: false,
            }, () => this.refs.toast.show('Appareil déconnecté, impossible de télécharger ou mettre à jour un questionnaire', 2000));
        }
        else {
            this.setState({
                connected: true,
            }, () => {
                    this.refs.toast.show('Appareil connecté', 2000);
                    this.sendStockedAnswers();
                    this.sendStockedFilesV2();
                }
            );
            
        }
    };

    sendStockedAnswers = () => {
        let surveyAnswers = this.state.realm.objects('surveyAnswer').sorted('surveyId', true);
        if(surveyAnswers.length > 0){
            for(let i = 0; i < surveyAnswers.length; i++){
                let surveyAnswer = surveyAnswers[i];
                let input = {
                    'surveyId': surveyAnswer.surveyId,
                    'hangout': surveyAnswer.hangout,
                    'questionAnswers': surveyAnswer.questionAnswers,
                };
                this.props.AddSurveyAnswer({variables: {input}}).then(
                    () => {
                        this.state.realm.write(() => {
                            this.state.realm.objects('survey').filtered('id = $0', surveyAnswer.surveyId)[0].sentAnswers++;
                            this.state.realm.objects('survey').filtered('id = $0', surveyAnswer.surveyId)[0].stockedAnswers--;
                            this.state.realm.delete(surveyAnswer);
                        });
                    }, 
                    (error) => {
                        if(error.graphQLErrors[0].code === 404){
                            this.state.realm.write(() => {
                                this.state.realm.delete(surveyAnswer);
                            });
                        }
                    }
                );
            }
        }
    };

    sendStockedFilesV2 = async () => {
        let files = this.state.realm.objects('file').sorted('surveyId', true).slice();
        if(files.length > 0){
            for(let file of files){
                if(this.state.connected){
                    await this.sendSingleFile(file).then(
                        (response) => {
                            this.state.realm.write(() => {
                                this.state.realm.delete(this.state.realm.objects('file').filtered('filename = $0', file.filename));
                            });
                        } 
                    ).catch(
                        (error) => {
                            if(error === 1){
                                this.state.realm.write(() => {
                                    this.state.realm.delete(this.state.realm.objects('file').filtered('filename = $0', file.filename));
                                });
                            }
                        }
                    )
                }
            }
        }
    };

    sendSingleFile = (file) => {
        return new Promise((resolve, reject) => {
            RNFetchBlob.fs.readStream(file.filepath, 'base64', 2097150, 1000).then((ifstream) => {
                ifstream.open();
                ifstream.onData((chunk) => {
                    let formData = new FormData();
                    formData.append('file', chunk);
                    formData.append('filename', file.filename);
                    formData.append('surveyId', file.surveyId);
                    formData.append('hangout', file.hangout);
                    fetch(`http://${server.url}/${server.saveEndpoint}`, {
                        method: `POST`,
                        body: formData,
                    }).then(
                        undefined,
                        (error) => {
                            reject(2);
                        },
                    );
                });
                ifstream.onError((error) => {
                    reject(1);
                });
                ifstream.onEnd(() => {
                    resolve(0);
                });
            });            
        });
    };

    navigateToForm = (survey, isActive) => {
        if(isActive || survey.activationKey === ''){
            this.props.navigation.navigate('FormScreen', { survey: survey, realm: this.state.realm });
        }
        else {
            this.setState({
                surveyToCheck: survey,
            }, () => this.toggleActivationKeyDialogVisibility(true));
        }
    };

    checkActivationKey = (activationKey) => {
        this.toggleActivationKeyDialogVisibility(false);
        if(this.state.surveyToCheck.activationKey === activationKey){
            this.navigateToForm(this.state.surveyToCheck, true);
        }
        else {
            this.refs.toast.show('Le mot de passe est invalide', 2000);
        }
    };
    
    setFilter = (name, value) => {
        let slice = Object.assign({}, this.state.filters)
        this.setState({
            filters: Object.assign(slice, {[name]: value}),
        });
    };

    resetFilters = () => {
        this.setState({
            filters: {
                active: false,
                hangout: [false, false],
                answer: [false, false],
                name: '',
            },            
        });
    }

    saveFilters = () => {
        this.setState({
            formerFilters: this.state.filters,
        }, () => this.toggleFilterDialogVisibility(false));
    };

    cancelFilters = () => {
        this.setState({
            filters: this.state.formerFilters,
        }, () => this.toggleFilterDialogVisibility(false));
    };

    setSort = (value, reversed) => {
        this.setState({
            sort: {
                by: value,
                reversed: reversed,
            },
        });
    };

    filterSurvey = (survey) => {
        if(survey.name.indexOf(this.state.filters.name) === -1) return false;
        
        if(this.state.filters.hangout[0] && survey.hangout) return false;
        if(this.state.filters.hangout[1] && !survey.hangout) return false;

        if(this.state.filters.answer[0] && survey.stockedAnswers === 0) return false;
        if(this.state.filters.answer[1] && survey.sentAnswers === 0) return false;

        let deactivationDate = moment.utc(survey.deactivationDate, 'DD-MM-YYYY HH:mm');
        let activationDate = moment.utc(survey.activationDate, 'DD-MM-YYYY HH:mm');
        if(this.state.filters.active && (moment().isBefore(activationDate) || moment().isAfter(deactivationDate))) return false;

        return true;
    };

    sortSurveys = (surveyA, surveyB) => {
        switch(this.state.sort.by){
            case 'name':
                return(surveyA.name > surveyB.name ? 1 * this.state.sort.reversed: -1 * this.state.sort.reversed);
            case 'hangout':
                if(surveyA.hangout) return(surveyB.hangout ? 0: 1 * this.state.sort.reversed);
                else return(surveyB.hangout ?  -1 * this.state.sort.reversed: 0);
            case 'active':
                let isActiveA = true;
                let deactivationDateA = moment.utc(surveyA.deactivationDate, 'DD-MM-YYYY HH:mm');
                let activationDateA = moment.utc(surveyA.activationDate, 'DD-MM-YYYY HH:mm');
                if(moment().isAfter(deactivationDateA) || moment().isBefore(activationDateA)) isActiveA = false;

                let isActiveB = true;
                let deactivationDateB = moment.utc(surveyB.deactivationDate, 'DD-MM-YYYY HH:mm');
                let activationDateB = moment.utc(surveyB.activationDate, 'DD-MM-YYYY HH:mm');
                if(moment().isAfter(deactivationDateB) || moment().isBefore(activationDateB)) isActiveB = false;

                if(isActiveA) return(isActiveB ? 0: -1 * this.state.sort.reversed);
                else return(isActiveB ? 1 * this.state.sort.reversed: 0);
            case 'stockedAnswers':
                if(surveyA.stockedAnswers > surveyB.stockedAnswers) return -1 * this.state.sort.reversed;
                else return(surveyA.stockedAnswers === surveyB.stockedAnswers ? 0: 1 * this.state.sort.reversed);
            case 'sentAnswers':
                if(surveyA.sentAnswers > surveyB.sentAnswers) return -1 * this.state.sort.reversed;
                else return(surveyA.sentAnswers === surveyB.sentAnswers ? 0: 1 * this.state.sort.reversed);
            default:
                return 1;
        }
    };

    deleteSurvey = (id) => {
        this.state.realm.write(() => {
            this.state.realm.delete(this.state.realm.objects('survey').filtered('id = $0', id));
            this.state.realm.delete(this.state.realm.objects('surveyAnswer').filtered('surveyId = $0', id));
        });
        this.refs.toast.show(`Questionnaire supprimé`, 2000);
    };

    writeSurvey = (surveyFromLink) => {
        this.toggleDownloadDialogVisibility(false);
        let rewrited = false;
        this.state.realm.write(() => {
            rewrited = !!this.state.realm.objects('survey').filtered('link = $0', surveyFromLink.link).length;
            let stockedAnswers = rewrited ? this.state.realm.objects('survey').filtered('link = $0', surveyFromLink.link)[0].stockedAnswers: 0;
            let sentAnswers = rewrited ? this.state.realm.objects('survey').filtered('link = $0', surveyFromLink.link)[0].sentAnswers: 0;
            this.state.realm.delete(this.state.realm.objects('survey').filtered('link = $0', surveyFromLink.link));
            this.state.realm.delete(this.state.realm.objects('surveyAnswer').filtered('surveyId = $0', Number(surveyFromLink.id)));
            let sections = [];
            for(let i = 0; i < surveyFromLink.sections.length; i++){
                let questions = [];
                for(let j = 0; j < surveyFromLink.sections[i].questions.length; j++){
                    let question = this.state.realm.create('question', {
                        id: Number(surveyFromLink.sections[i].questions[j].id),
                        name: surveyFromLink.sections[i].questions[j].name,
                        index: Number(surveyFromLink.sections[i].questions[j].index),
                        description: surveyFromLink.sections[i].questions[j].description,
                        mandatory: surveyFromLink.sections[i].questions[j].mandatory,
                        type: surveyFromLink.sections[i].questions[j].type,
                        hangout: surveyFromLink.sections[i].questions[j].hangout,
                        askFor: surveyFromLink.sections[i].questions[j].askFor,
                        linesNumber: Number(surveyFromLink.sections[i].questions[j].linesNumber),
                        columnsNumber: Number(surveyFromLink.sections[i].questions[j].columnsNumber),
                        linesLabels: surveyFromLink.sections[i].questions[j].linesLabels,
                        columnsLabels: surveyFromLink.sections[i].questions[j].columnsLabels,
                        linesImages: surveyFromLink.sections[i].questions[j].linesImages,
                        columnsImages: surveyFromLink.sections[i].questions[j].columnsImages,
                        numberOfAnswers: Number(surveyFromLink.sections[i].questions[j].numberOfAnswers),
                        valuesAsImages: surveyFromLink.sections[i].questions[j].valuesAsImages,
                        numberOfValues: Number(surveyFromLink.sections[i].questions[j].numberOfValues),
                        values: surveyFromLink.sections[i].questions[j].values,
                        topLabel: surveyFromLink.sections[i].questions[j].topLabel,
                        bottomLabel: surveyFromLink.sections[i].questions[j].bottomLabel,
                        fileTypes: surveyFromLink.sections[i].questions[j].fileTypes,
                        commentary: surveyFromLink.sections[i].questions[j].commentary,
                        scaleMin: Number(surveyFromLink.sections[i].questions[j].scaleMin),
                        scaleMax: Number(surveyFromLink.sections[i].questions[j].scaleMax),
                        step: parseFloat(surveyFromLink.sections[i].questions[j].step),
                        labelsValues: surveyFromLink.sections[i].questions[j].labelsValues,
                        selectedValue: surveyFromLink.sections[i].questions[j].selectedValue,
                        graduation: surveyFromLink.sections[i].questions[j].graduation,
                        gradient: surveyFromLink.sections[i].questions[j].gradient,
                        gradientType: Number(surveyFromLink.sections[i].questions[j].gradientType),
                        dateInterval: surveyFromLink.sections[i].questions[j].dateInterval,
                        dateMin: surveyFromLink.sections[i].questions[j].dateMin,
                        dateMax: surveyFromLink.sections[i].questions[j].dateMax,                        
                    });
                    questions.push(question);
                }
                let section = this.state.realm.create('section', {
                    id: Number(surveyFromLink.sections[i].id),
                    name: surveyFromLink.sections[i].name,
                    image: surveyFromLink.sections[i].image,
                    index: Number(surveyFromLink.sections[i].index),
                    description: surveyFromLink.sections[i].description,
                    hangout: surveyFromLink.sections[i].hangout,  
                    questions: questions,                 
                });
                sections.push(section);
            }
            let questions = [];
            for(let i = 0; i < surveyFromLink.questions.length; i++){
                let question = this.state.realm.create('question', {
                    id: Number(surveyFromLink.questions[i].id),
                    name: surveyFromLink.questions[i].name,
                    index: Number(surveyFromLink.questions[i].index),
                    description: surveyFromLink.questions[i].description,
                    mandatory: surveyFromLink.questions[i].mandatory,
                    type: surveyFromLink.questions[i].type,
                    hangout: surveyFromLink.questions[i].hangout,
                    askFor: surveyFromLink.questions[i].askFor,
                    linesNumber: Number(surveyFromLink.questions[i].linesNumber),
                    columnsNumber: Number(surveyFromLink.questions[i].columnsNumber),
                    linesLabels: surveyFromLink.questions[i].linesLabels,
                    columnsLabels: surveyFromLink.questions[i].columnsLabels,
                    linesImages: surveyFromLink.questions[i].linesImages,
                    columnsImages: surveyFromLink.questions[i].columnsImages,
                    numberOfAnswers: Number(surveyFromLink.questions[i].numberOfAnswers),
                    valuesAsImages: surveyFromLink.questions[i].valuesAsImages,
                    numberOfValues: Number(surveyFromLink.questions[i].numberOfValues),
                    values: surveyFromLink.questions[i].values,
                    topLabel: surveyFromLink.questions[i].topLabel,
                    bottomLabel: surveyFromLink.questions[i].bottomLabel,
                    fileTypes: surveyFromLink.questions[i].fileTypes,
                    commentary: surveyFromLink.questions[i].commentary,
                    scaleMin: Number(surveyFromLink.questions[i].scaleMin),
                    scaleMax: Number(surveyFromLink.questions[i].scaleMax),
                    step: parseFloat(surveyFromLink.questions[i].step),
                    labelsValues: surveyFromLink.questions[i].labelsValues,
                    selectedValue: surveyFromLink.questions[i].selectedValue,
                    graduation: surveyFromLink.questions[i].graduation,
                    gradient: surveyFromLink.questions[i].gradient,
                    gradientType: Number(surveyFromLink.questions[i].gradientType),
                    dateInterval: surveyFromLink.questions[i].dateInterval,
                    dateMin: surveyFromLink.questions[i].dateMin,
                    dateMax: surveyFromLink.questions[i].dateMax,
                });
                questions.push(question);
            }
            let survey = this.state.realm.create('survey', {
                id: Number(surveyFromLink.id),
                name: surveyFromLink.name,
                link: surveyFromLink.link,
                image: surveyFromLink.image,
                description: surveyFromLink.description,
                hangout: surveyFromLink.hangout,
                activationDate: surveyFromLink.activationDate,
                deactivationDate: surveyFromLink.deactivationDate,
                activationKey: surveyFromLink.activationKey,
                language: surveyFromLink.language,
                lastUpdate: surveyFromLink.lastUpdate,
                sections: sections,
                questions: questions,
                stockedAnswers: stockedAnswers,
                sentAnswers: sentAnswers,
            });
        });
        this.refs.toast.show(`Questionnaire ${rewrited ? 'mis à jour': 'téléchargé'}`, 2000);
    };

    handleError = (error, link) => {
        alert(JSON.stringify(error));
        this.toggleDownloadDialogVisibility(false);
        if(error.graphQLErrors[0] === undefined){
            this.refs.toast.show(`Impossible de joindre le serveur`, 2000);
        }
        else if(error.graphQLErrors[0].code === 404){
            this.refs.toast.show(`Le lien ${link} est invalide`, 2000);
        }
        else if(this.state.connected === false){
            this.refs.toast.show(`Appareil déconnecté, impossible de télécharger ou mettre à jour un questionnaire`, 2000);
        }
        else {
            this.refs.toast.show(`Impossible de joindre le serveur`, 2000);
        }
    };

    toggleDownloadDialogVisibility = (visible) => {
        this.setState({
            showDownloadDialog: visible,
        });
    };

    toggleFilterDialogVisibility = (visible) => {
        this.setState({
            showFilterDialog: visible,
        });
    };

    toggleSortDialogVisibility = (visible) => {
        this.setState({
            showSortDialog: visible,
        });
    };

    toggleActivationKeyDialogVisibility = (visible) => {
        this.setState({
            showActivationKeyDialog: visible,
        });
    };

    render = () => {
        if(this.state.realm === null){
            return(
                <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center'}}>
                    <MKSpinner/>
                </View>
            );
        }

        let surveyCards = [];
        let surveysAsArray = Array.from(this.state.realm.objects('survey')).sort(this.sortSurveys);
        for(let i = 0; i < surveysAsArray.length; i++){
            if(this.filterSurvey(surveysAsArray[i])){
                surveyCards.push(
                    <SurveyCard
                        key={i}
                        survey={surveysAsArray[i]}
                        navigateToForm={this.navigateToForm}
                        deleteSurvey={this.deleteSurvey}
                        writeSurvey={this.writeSurvey}
                        handleError={this.handleError}
                    />
                );
            }
        }
        
        return (
            <View style={styles.windowContainer}>
                <ScrollView>
                    <View style={styles.columnContainer}>
                        {surveyCards}
                    </View>
                </ScrollView>
                <ActionButton
                    buttonColor={COLOR_PALETTE.secondaryColor.S500}
                    activeOpacity={0.5}
                >
                    <ActionButton.Item
                        buttonColor={COLOR_PALETTE.secondaryColor.S500}
                        textContainerStyle={styles.actionButtonContainer}
                        textStyle={styles.actionButtonText}
                        onPress={() => this.toggleSortDialogVisibility(true)}
                    >
                        <Icon
                            name={'sort'}
                            size={25}
                            color={COLOR_PALETTE.white}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor={COLOR_PALETTE.secondaryColor.S500}
                        textContainerStyle={styles.actionButtonContainer}
                        textStyle={styles.actionButtonText}
                        onPress={() => this.toggleFilterDialogVisibility(true, false, null)}
                    >
                        <Icon
                            name={'filter'}
                            size={25}
                            color={COLOR_PALETTE.white}
                        />
                    </ActionButton.Item>
                    <ActionButton.Item
                        buttonColor={COLOR_PALETTE.secondaryColor.S500}
                        textContainerStyle={styles.actionButtonContainer}
                        textStyle={styles.actionButtonText}
                        onPress={this.state.connected ?
                            () => this.toggleDownloadDialogVisibility(true):
                            () => this.refs.toast.show('Appareil déconnecté, impossible de télécharger ou mettre à jour un questionnaire', 2000)
                        }
                    >
                        <Icon
                            name={'download'}
                            size={25}
                            color={COLOR_PALETTE.white}
                        />
                    </ActionButton.Item>
                </ActionButton>
                <FilterDialog
                    visible={this.state.showFilterDialog}
                    filters={this.state.filters}
                    setFilter={this.setFilter}
                    resetFilters={this.resetFilters}
                    saveFilters={this.saveFilters}
                    cancelFilters={this.cancelFilters}
                />
                <SortDialog
                    visible={this.state.showSortDialog}
                    sort={this.state.sort}
                    setSort={this.setSort}
                    toggleSortDialogVisibility={this.toggleSortDialogVisibility}
                />
                <DownloadDialog
                    visible={this.state.showDownloadDialog}
                    toggleDownloadDialogVisibility={this.toggleDownloadDialogVisibility}
                    writeSurvey={this.writeSurvey}
                    handleError={this.handleError}
                />
                <ActivationKeyDialog
                    visible={this.state.showActivationKeyDialog}
                    toggleActivationKeyDialogVisibility={this.toggleActivationKeyDialogVisibility}
                    survey={this.state.survey}
                    checkActivationKey={this.checkActivationKey}
                />
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

} export default compose(AddSurveyAnswer)(ExplorerScreen);