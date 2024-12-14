import { StyleSheet } from 'react-native';

const sidebar = StyleSheet.create({
    sidebar: {
        position: 'absolute',
        left: 0,
        top: 10,
        bottom: 10,
        width: 400,
        padding: 16,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    title: {
        fontSize: 35,
        textAlign: 'center',
    },
});

const page = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        marginLeft: 400,
        padding: 16,
    },
    text: {
        fontSize: 20,
    },
});

export { sidebar, page };