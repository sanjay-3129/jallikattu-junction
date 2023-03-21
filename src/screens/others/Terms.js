import {
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import BackButton from '../../assets/svg/backbutton.svg';

const Terms = ({navigation}) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#6f0b83'} barStyle="light-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <BackButton />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms And Conditions</Text>
        <View />
      </View>
      <ScrollView
        contentContainerStyle={{paddingVertical: 20}}
        style={styles.helpContainer}>
        <View>
          <Text
            style={{
              fontFamily: 'Montserrat-Bold',
              padding: 10,
              fontSize: 16,
              lineHeight: 24,
            }}>
            Terms and Conditions{' '}
          </Text>
          <Text
            style={{
              fontFamily: 'Montserrat-Regular',
              padding: 10,
              fontSize: 16,
              lineHeight: 24,
            }}>
            The website www.jallikattumilk.com and mobile application
            “Jallikattu Junction” is owned and operated by RKR Dairy Products
            Private Limited (RDPPL), an India based company incorporated under
            the Indian Companies Act of 1956 . The policy is issued by ‘RDPPL’.
            By placing an order on this site you are entering into a
            purchase/sale transaction with RDPPL. The terms and conditions are
            enumerated as follows Definitions "Agreement" means the terms and
            conditions as detailed herein including all schedules, appendices,
            annexure, privacy policy and will include the references to this
            Agreement as amended, supplemented, varied or replaced from time to
            time. www.jallikattumilk.com or the “Site” means the online shopping
            portal and “Jallikattu Junction '' or the “mobile app” means the
            mobile application owned and operated by RDPPL which provides a
            platform to the shoppers to buy the products listed on the site and
            mobile app. "Vendor"/"Seller"/"Affiliate" shall mean the person or
            any legal entity who offers for sale, sells the products or services
            on www.jallikattumilk.com "Customer" / "Buyer" shall mean the person
            or any legal entity who accepts the offer for sale on site or mobile
            app by placing an order for and or purchasing any products offered
            for sale on the site or mobile app. "User"/ "You" means and includes
            you and/or any person or an entity including Vendor/Seller/Affiliate
            using or accessing the services provided on the Site and mobile app.
            Eligibility You represent and warrant that you are competent and
            eligible to enter into a legally binding agreement and have the
            requisite authority to bind the other party to this Agreement. You
            shall not use this Site or mobile app if you are not competent to
            contract under the applicable laws, rules and regulations. Term This
            Agreement shall continue to be in full force and effect for so long
            as you are using the site or mobile app. The site and mobile app
            provide an online shopping platform wherein the Users can
            purchase/buy the products and services listed on it pursuant to the
            terms and conditions set forth below. By clicking on the “Proceed to
            Payment” button, you are agreeing to use the Services in a manner
            consistent with and abide by the terms and conditions of this
            Agreement, our Privacy Policy, and with all applicable laws and
            regulations. Termination Either User/ You or RDPPL may terminate the
            agreement at any time, with or without cause. However, RDPPL
            reserves the right, in its sole discretion, to terminate your access
            to the products and services offered on the site and mobile app or
            any portion thereof at any time, without notice. Modification of
            Terms and Conditions RDPPL may at any time modify the terms and
            conditions contained on the Site and mobile app without any prior
            notification to you. You can access the latest version of the Terms
            and Conditions at any given time. You should regularly review the
            Terms and Conditions. In the event the modified Terms and Conditions
            are not acceptable to you, you should discontinue using the site or
            mobile app. However, if you continue to use the site or mobile app,
            you agree to accept and abide by the modified Terms and Conditions.
            Online Shopping Platform You further agree and undertake that you
            are accessing the services available on this Site and mobile app and
            transacting at your sole risk and are using your best and prudent
            judgement before entering into any transaction through this Site or
            mobile app. RDPPL accepts no liability for any errors or omissions,
            whether on behalf of itself or third parties. The address at which
            delivery of the products ordered by you are to be made should be
            correct and proper in all respects. After the receipt of payment,
            RDPPL shall arrange for the delivery of the product to the recipient
            at the shipping address provided by the Buyer. Any and all orders
            placed by you on this Site and mobile app are a firm commitment to
            purchase and you are obligated to complete the transaction and not
            contest it in any way. Before placing an order you are advised to
            check the product description carefully. By placing an order for a
            product you agree to be bound by the conditions of sale included in
            the item's description. Product Pricing Product prices listed on the
            website and mobile app are current. While every care has been taken
            to label the products accurately, errors in data entry and updation
            may occur. RDPPL reserves the right to cancel the order. The
            refundable amount is credited to the customer's wallet. Refunds are
            credited within 5-7 working days. Offers Maximum 1 Offer on 1
            Address Offer valid on first recharge only Cancellation Policy
            Customers can cancel/stop their subscription using Jallikattu
            Junction mobile application Multiple Accounts cannot be created with
            the same address, if found then Jallikattu has the right to
            cancel/stop the customer's subscription Entire Agreement These Terms
            and Conditions, together with privacy policy, and other rules and
            policies posted on the site and mobile app, which are hereby
            incorporated as set forth fully in these Terms and Conditions,
            constitutes the entire agreement between you and RDPPL with respect
            to your use of and material available through the site and mobile
            app, and supersedes all prior or contemporaneous communications and
            proposals between you and RDPPL with respect to this site and mobile
            app. Any rights not expressly granted in these Terms and Conditions
            are reserved. Communication By registering with the site and mobile
            app, you give us the permission to send you notifications on
            WhatsApp. Billing Policy & Payment The bill is generated once the
            payment is made. Return Policy Returns are not accepted. Pre-paid
            Products All products are prepaid. You are required to recharge your
            wallet with the MRP of the select product via the various payment
            modes available. Communication Policy By signing up on the site or
            mobile app, customer agrees to receive communication on WhatsApp,
            push notifications, SMS, Email, Customer Support Call, Mobile App
            and Website. Disclaimer "We as a Retailer shall be under no
            liability whatsoever in respect of any loss or damage arising
            directly or indirectly out of the decline of authorization for any
            Transaction, on Account of the Cardholder having exceeded the preset
            limit mutually agreed by us with our acquiring bank from time to
            time". Any difference between the representational image and the
            original product is for advertorial purposes only.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Terms;

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
    paddingHorizontal: 10,
  },
});
