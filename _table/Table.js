import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const Table = () => {
    const navigation = useNavigation();
    const [tables, setTables] = useState([]);

    useEffect(() => {
        const loadTables = async () => {
            try {
                const storedTables = await AsyncStorage.getItem('tables');
                if (storedTables !== null) {
                    setTables(JSON.parse(storedTables));
                } else {
                    setTables([...Array(12).keys()].map(i => i + 1));
                }
            } catch (error) {
                console.error('Failed to load the Tables.', error);
            }
        };
        loadTables();
    }, []);

    useEffect(() => {
        const saveTables = async () => {
            try {
                await AsyncStorage.setItem('tables', JSON.stringify(tables));
            } catch (error) {
                console.error('Failed to save the tables.', error);
            }
        };
        saveTables();
    }, [tables]);

    const addTable = () => {
        setTables(prevTables => [...prevTables, prevTables.length + 1]);
    };

    const handleTablePress = (tableNumber) => {
        navigation.navigate('Cashier', {tableNumber});
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <TouchableOpacity onPress={addTable} style={styles.addTable}>
                    <Text style={styles.addTableText}>Add Table</Text>
                </TouchableOpacity>
                <View style={styles.gridContainer}>
                    {tables.map(i => (
                        <TouchableOpacity key={i} onPress={() => handleTablePress(i)} style={styles.table}>
                            <Text style={styles.tableText}>Table {i}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default Table;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#bbf7d0',
    },
    scrollView: {
        flexGrow: 1,
        alignItems: 'center',
    },
    addTable: {
        marginTop: hp(2),
        padding: hp(2),
        width: wp(90),
        backgroundColor: 'green',
        borderRadius: 10,
        alignItems: 'center',
    },
    addTableText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: '800',
        textAlign: 'center',
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: hp(2),
    },
    table: {
        width: wp(40),
        margin: wp(2),
        padding: hp(2),
        backgroundColor: '#065F46',
        borderRadius: 10,
        alignItems: 'center',
    },
    tableText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
});
