import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({
    columnContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    rowContainer: {
        width: Dimensions.get('window').width,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    image: {
        width: Dimensions.get('window').width - 10,
        height: 200,
        margin: 5,
        justifyContent: 'center',
    },
    video: {
        width: Dimensions.get('window').width - 10,
        height: 200,
        margin: 5,
        justifyContent: 'center',
    },
    commentary: {
        width: Dimensions.get('window').width - 10,
    }
});

export default styles;