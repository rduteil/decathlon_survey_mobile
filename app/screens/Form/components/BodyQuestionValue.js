import React, { Component } from 'react';
import { View, TextInput } from 'react-native';

class BodyQuestionValue extends Component {
    constructor(props){
        super(props);
        this.state = {
            answer: '',
        };
    }

    onChange = (event) => {
        this.setState({
            answer: event.nativeEvent.text,
        }, () => this.props.changeAnswer(this.props.id, this.state.answer));
    };

    render(){
        switch(this.props.askFor){
            case 'number':
                return(
                    <TextInput
                        keyboardType={'numeric'}
                        placeholder={'Entrez votre réponse...'}
                        autoCapitalize={'none'}
                        autoCorrect={false}
                        onEndEditing={(event) => this.onChange(event)}
                    />
                );
                break;
            case 'singleline':
                return(
                    <View>
                        <TextInput
                            placeholder={'Entrez votre réponse...'}
                            onEndEditing={(event) => this.onChange(event)}
                        />
                    </View>
                );
            case 'paragraphe':
                return(
                    <View>
                        <TextInput
                            placeholder={'Entrez votre réponse...'}
                            onEndEditing={(event) => this.onChange(event)}
                            multiline={true}
                        />
                    </View>
                );
            default:
                return(
                    <View>
                        <TextInput
                            placeholder={'Entrez votre réponse...'}
                            onEndEditing={(event) => this.onChange(event)}
                        />
                    </View>
                );
        }
    }

} export default BodyQuestionValue;