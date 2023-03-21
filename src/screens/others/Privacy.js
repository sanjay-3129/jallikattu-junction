import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import BackButton from '../../assets/svg/backbutton.svg';

const Privacy = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View />
      </View>
      <ScrollView
        contentContainerStyle={{paddingVertical: 20}}
        style={styles.helpContainer}>
        <Text
          style={{
            fontFamily: 'Montserrat-Regular',
            padding: 10,
            fontSize: 16,
            lineHeight: 24,
          }}>
          RKR Dairy Products Private Limited (“RDPPL”) is the licensed owner of
          the brand “Jallikattu” ,the website www.jallikattumilk.com (”The
          Site”) and the mobile application “Jallikattu Junction” (“Mobile
          app”). RDPPL respects your privacy. This Privacy Policy provides
          succinctly the manner your data is collected and used by RDPPL on the
          Site and mobile app. As a visitor to the site/mobile app, customers
          are advised to please read the Privacy Policy carefully. By accessing
          the services provided by the Site and mobile app you agree to the
          collection and use of your data by RDPPL in the manner provided in
          this Privacy Policy. As part of the registration process on the
          Site/mobile app, RDPPL may collect the following personally
          identifiable information about you: Name including first and last
          name, alternate email address, mobile phone number and contact
          details, Postal code, Demographic profile (like your age, gender,
          occupation, education, address etc.) and information about the pages
          on the site you visit/access, the links you click on the site, the
          number of times you access the page and any such browsing information.
          RDPPL will collect personally identifiable information about you only
          as part of a voluntary registration process, on-line survey or any
          combination thereof. The site may contain links to other websites.
          RDPPL is not responsible for the privacy practices of such websites
          which it does not own, manage or control. The site and third-party
          vendors, including Google, use first-party cookies (such as the Google
          Analytics cookies) and third-party cookies (such as the DoubleClick
          cookie) together to inform, optimise, and serve ads based on someone's
          past visits to the site. RDPPL will use your personal information to
          provide personalised features to you on the Site/mobile app and to
          provide promotional offers to you through the Site/mobile app and
          other channels. RDPPL will also provide this information to its
          business associates and partners to get in touch with you when
          necessary to provide the services requested by you. RDPPL will use
          this information to preserve transaction history as governed by
          existing law or policy. RDPPL may also use the contact information
          internally to direct its efforts for product improvement, to contact
          you as a survey respondent, to notify you if you win any contest; and
          to send you promotional material from its contest sponsors or
          advertisers. RDPPL will also use this information to serve various
          promotional and advertising materials to you via display
          advertisements through the Google Ad network on third party websites.
          You can opt out of Google Analytics for Display Advertising and
          customize Google Display network ads using the Ads Preferences
          Manager. Information about Customers on an aggregate (excluding any
          information that may identify you specifically) covering Customer
          transaction data and Customer demographic and location data may be
          provided to partners of RDPPL for the purpose of creating additional
          features on the website, creating appropriate merchandising or
          creating new products and services and conducting marketing research
          and statistical analysis of customer behaviour and transactions. RDPPL
          will not use your financial information for any purpose other than to
          complete a transaction with you. RDPPL does not rent, sell or share
          your personal information and will not disclose any of your personally
          identifiable information to third parties. In cases where it has your
          permission to provide products or services you've requested and such
          information is necessary to provide these products or services the
          information may be shared with RDPPL’s business associates and
          partners. RDPPL may, however, share consumer information on an
          aggregate with its partners or third parties where it deems necessary.
          In addition, RDPPL may use this information for promotional offers, to
          help investigate, prevent or take action regarding unlawful and
          illegal activities, suspected fraud, potential threat to the safety or
          security of any person, violations of the Site’s/Mobile app’s terms of
          use or to defend against legal claims; special circumstances such as
          compliance with subpoenas, court orders, requests/order from legal
          authorities or law enforcement agencies requiring such disclosure. To
          protect against the loss, misuse and alteration of the information
          under its control, RDPPL has in place appropriate physical, electronic
          and managerial procedures. For example, RDPPL servers are accessible
          only to authorised personnel and your information is shared with
          employees and authorised personnel on a need to know basis to complete
          the transaction and to provide the services requested by you. Although
          RDPPL will endeavour to safeguard the confidentiality of your
          personally identifiable information, transmissions made by means of
          the Internet cannot be made absolutely secure. By using this site, you
          agree that RDPPL will have no liability for disclosure of your
          information due to errors in transmission or unauthorised acts of
          third parties. To correct or update any information you have provided,
          the Site/Mobile app allows you to do it online. In the event of loss
          of access details you can send an email to: admin@rkrdairy.com RDPPL
          reserves the right to change or update this policy at any time. Such
          changes shall be effective immediately upon posting to the Site.
          Selling your data is strictly against our policy. We track your events
          and share them with our third-party analytics partners to provide you
          with better services. Grievance Officer In accordance with the
          Information Technology Act, 2000 and Rules made thereunder, the name
          and contact details of the Grievance Officer are provided below: Name:
          Balaji Address: No.7/1, Vaigai colony, 2nd cross street, 12th avenue,
          Ashok Nagar, Chennai - 83 Phone No: 75501 13222 E-mail:
          admin@rkrdairy.com If you wish to make a complaint regarding any
          violation of the provisions of the Policy, you may send a written
          complaint to the Grievance Officer, who shall redress the complaint in
          accordance with the provisions of the Information Technology Act, 2000
          and Rules made thereunder.
        </Text>
      </ScrollView>
    </View>
  );
};

export default Privacy;

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
    backgroundColor: 'white',
    borderTopEndRadius: 35,
    borderTopStartRadius: 35,
    paddingHorizontal: 10,
  },
});
