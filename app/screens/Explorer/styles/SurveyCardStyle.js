import { StyleSheet, Dimensions } from "react-native";

import { COLOR_PALETTE } from '../../../config/theme';

const styles = StyleSheet.create({
    mainContainer: {
        margin: 2,
        backgroundColor: COLOR_PALETTE.white,
        borderRadius: 2,
        justifyContent: 'center',
    },
    wrapperInColumn: {
        padding: 5,
        display: 'flex',
        flexDirection: 'column',
    },
    wrapperInRow: {
        display: 'flex',
        flexDirection: 'row',
        height: 110,
    },
    imageContainer: {
        width: 100,
        height: 100,
        marginRight: 10,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 2,
    },
    textWrapper: {
        flex: 1,
        flexDirection: 'column',
    },
    name: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    swipeButtonContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: 60,
        height: '100%',
    },
    swipeButton: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLOR_PALETTE.secondaryColor.S500,
        height: 50,
        width: 50,
        borderRadius: 25,
    },
    italicText: {
        fontStyle: 'italic',
        fontSize: 13,
    },
    triangleShape: {
        display: 'flex',
        flexWrap: 'nowrap',
        flexDirection: 'row',
        width: 30,
        height: 30,
        top: -20,
        transform: [{rotate: '45deg'}],
    },
});

export default styles;