import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { storage, db } from '../firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, uploadBytes, ref } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useCart } from '../_context/Cart';
import { useNavigation } from '@react-navigation/native';
import Avatar from '../_components/Avatar';

const MainCourse = () => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [prodImage, setProdImage] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [selectedProd, setSelectedProd] = useState(null);
    const [newName, setNewName] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const {cart, setCart} = useCart(); // Ensure useCart returns a proper array
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry', 'We need permission to make this work.');
            }
        })();
    }, []);

    useEffect(() => {
        const fetchProds = async () => {
            setLoading(true);
            try {
                const querySnapshot = await getDocs(collection(db, 'MainCourse'));
                const prodList = [];
                const imgList = [];
    
                for (const doc of querySnapshot.docs) {
                    const { Name, Price, ImgUrl } = doc.data();
                    const storedImageURL = await AsyncStorage.getItem(`storedImageURL_${doc.id}`);
                    
                    prodList.push({ Name, Price, id: doc.id });
                    imgList.push(storedImageURL || ImgUrl || '');
                }
    
                setProducts(prodList);
                setProdImage(imgList);
            } catch (error) {
                console.error('Error fetching Products.', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchProds();
    }, []);
    

    const pickImg = async (prodId) => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.7,
            });
    
            if (!result.canceled) {
                setLoading(true);
                const uploadURL = await uploadImg(result.assets[0].uri);
    
                if (uploadURL) {
                    await updateImg(prodId, uploadURL);
    
                    const prodIndex = products.findIndex(prod => prod.id === prodId);
                    const updatedImg = [...prodImage];
                    updatedImg[prodIndex] = uploadURL;
                    setProdImage(updatedImg);
    
                    await AsyncStorage.setItem(`storedImageURL_${prodId}`, uploadURL);
                } else {
                    throw new Error('Image upload failed.');
                }
            }
        } catch (error) {
            console.error('Failed to upload Image.', error);
            alert('Failed to upload Image.');
        } finally {
            setLoading(false);
        }
    };
    

    const updateImg = async (prodId, imgURL) => {
        try {
            const prodRef = doc(db, 'MainCourse', prodId);
            await updateDoc(prodRef, {
                ImgUrl: imgURL,
            });
        } catch (error) {
            console.error('Error updating product image:', error);
        }
    };

    const uploadImg = async (uri) => {
        if (!uri) {
            return null;
        }

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError('Network Request Failed.'));
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });

        try {
            const storageRef = ref(storage, `Image/image-${Date.now()}`);
            const snapShot = await uploadBytes(storageRef, blob);
            blob.close();

            const imgURL = await getDownloadURL(snapShot.ref);
            return imgURL;
        } catch (error) {
            console.error('Error uploading Image:', error);
            return null;
        }
    };

    const openEditModal = (prod) => {
        setSelectedProd(prod);
        setNewName(prod.Name);
        setNewPrice(prod.Price);
        setOpenModal(true);
    };

    const saveChange = async () => {
        if (selectedProd) {
            try {
                const prodRef = doc(db, 'MainCourse', selectedProd.id);
                await updateDoc(prodRef, {
                    Name: newName,
                    Price: newPrice,
                });

                const updatedProd = products.map((prod) => prod.id === selectedProd.id ? {
                    ...prod, Name: newName, Price: newPrice
                } : prod );

                setProducts(updatedProd);
                setOpenModal(false);
            } catch (error) {
                console.error('Error updating Products:', error);
            }
        }
    };

    const AddToCart = (prod, imgURL) => {
        setCart(prevCart => {
            const existingProdIndex = prevCart.findIndex(item => item.Name === prod.Name);
            if (existingProdIndex >= 0) {
                const updatedCart = [...prevCart];
                updatedCart[existingProdIndex].quantity += 1;
                return updatedCart;
            } else {
                return [...prevCart, {
                    ...prod, imgURL: imgURL, quantity: 1,
                }];
            }
        });
        navigation.navigate('Cashier');
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <TouchableOpacity style={styles.addButton} onPress={pickImg}>
                    <Text style={styles.buttonText}>Add Product</Text>
                </TouchableOpacity>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
                ) : (
                    <View style={styles.avatarsContainer}>
                        {products.map((product, index) => (
                            <View key={product.id} style={styles.productContainer}>
                                <Avatar uri={prodImage[index] || ''} onPress={() => pickImg(product.id)} />
                                <TouchableOpacity onPress={() => openEditModal(product)}>
                                    <Text style={styles.productName}>{product.Name}</Text>
                                    <Text style={styles.productPrice}>{product.Price}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addToCartButton} onPress={() => AddToCart(product, prodImage[index])}>
                                    <Text style={styles.addToCartText}>Add to Cart</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>

            <Modal
                animationType="slide"
                transparent={true}
                visible={openModal}
                onRequestClose={() => setOpenModal(false)}
            >
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <TextInput
                            style={styles.input}
                            placeholder="Product Name"
                            value={newName}
                            onChangeText={setNewName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Product Price"
                            value={newPrice}
                            onChangeText={setNewPrice}
                        />
                        <TouchableOpacity onPress={saveChange} style={styles.bgButtonSave}>
                            <Text style={styles.textSave}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOpenModal(false)} style={styles.buttonClose}>
                            <Text style={styles.textStyle}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default MainCourse;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    scrollViewContent: {
        paddingBottom: 20,
    },
    addButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    avatarsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    productContainer: {
        alignItems: 'center',
        margin: 10,
    },
    productName: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
    },
    productPrice: {
        marginTop: 5,
        fontSize: 14,
        color: '#888',
    },
    addToCartButton: {
        backgroundColor: '#FF5722',
        padding: 8,
        marginTop: 10,
        borderRadius: 5,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 14,
    },
    loadingIndicator: {
        marginTop: 20,
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        width: '80%',
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
        width: '100%',
    },
    bgButtonSave: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    textSave: {
        color: '#fff',
        fontSize: 16,
    },
    buttonClose: {
        marginTop: 10,
        backgroundColor: '#f44336',
        padding: 10,
        borderRadius: 5,
        width: '100%',
        alignItems: 'center',
    },
    textStyle: {
        color: '#fff',
        fontSize: 16,
    },
})
