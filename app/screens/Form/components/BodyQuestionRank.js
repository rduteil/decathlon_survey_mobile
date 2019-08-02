import React, { Component } from 'react';
import { TouchableHighlight, Text, View, ScrollView, Dimensions, Animated } from 'react-native';
import SortableList from 'react-native-sortable-list';

import RankableRow from '../components/bodyQuestionRank/RankableRow';
import styles from '../styles/BodyQuestionRankStyle';

class BodyQuestionRank extends Component {
    constructor(props){
        super(props);

        let data = {};
        for(let i = 0; i < this.props.numberOfValues; i++){
            data[i] = {label: this.props.values[i], image: this.props.values[i + 10]};
        }

        this.state = {
            data: data,
            answer: [],
        }
    }

    renderRow = ({data, active}) => {
        return <RankableRow data={data} active={active} />
    };

    changeAnswer = (nextOrder) => {
        let nextAnswer = [];
        for(let i = 0; i < this.props.numberOfValues; i++){
            nextAnswer.push(this.state.data[nextOrder[i]].label);
        }
        this.setState({
            answer: nextAnswer,
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    render(){
        return(
            <View style={styles.columnContainer}>
                <Text style={styles.label}>
                    {this.props.topLabel}
                </Text>
                <SortableList
                    rowActivationTime={50}
                    data={this.state.data}
                    renderRow={this.renderRow}
                    autoscrollAreaSize={9999}
                    onActivateRow={() => this.props.enableScrolling(false)}
                    onReleaseRow={() => {this.props.enableScrolling(true);}}
                    onChangeOrder={(newOrder) => this.changeAnswer(newOrder)}
                />
                <Text style={styles.label}>
                    {this.props.bottomLabel}
                </Text>
            </View>
        );
    }

} export default BodyQuestionRank;