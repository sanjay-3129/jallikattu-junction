import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import BackButton from '../../assets/svg/backbutton.svg';
import firestore from '@react-native-firebase/firestore';

const Help = ({navigation}) => {
  const [faq, setFaq] = useState([]);

  const getFaq = async () => {
    const result = await firestore().collection('faq').get();
    let faqArray = [];
    result.forEach(data => {
      faqArray.push({...data.data(), id: data.id});
    });
    setFaq(faqArray);
  };

  useEffect(() => {
    getFaq();
  }, []);

  const [activeItem, setActiveItem] = useState('');

  const RenderItem = ({item}) => {
    return (
      <View style={styles.accordion}>
        <TouchableOpacity
          onPress={() =>
            activeItem === item.question
              ? setActiveItem('')
              : setActiveItem(item.question)
          }
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>{item.question}</Text>
          {activeItem === item.question ? (
            <Text style={{fontSize: 30}}>-</Text>
          ) : (
            <Text style={{fontSize: 30}}>+</Text>
          )}
        </TouchableOpacity>
        {activeItem === item.question && (
          <Text style={styles.desc}>{item.answer}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help</Text>
        <View />
      </View>
      <View style={styles.helpContainer}>
        <FlatList
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={{paddingBottom: 80}}
          data={faq}
          renderItem={RenderItem}
        />
      </View>
    </View>
  );
};

export default Help;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6f0b83',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 25,
  },
  headerTitle: {
    fontSize: 20,
    lineHeight: 24,
    fontFamily: 'Montserrat-Bold',
    color: '#ffd688',
    textTransform: 'uppercase',
  },
  helpContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    paddingTop: 35,
    paddingHorizontal: 10,
  },
  accordion: {
    backgroundColor: 'white',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  title: {
    color: 'black',
    fontFamily: 'Montserrat-Bold',
    fontSize: 18,
    lineHeight: 20,
  },
  desc: {
    color: 'black',
    fontFamily: 'Montserrat-Regular',
    fontSize: 13,
    lineHeight: 15,
    marginTop: 10,
  },
});
