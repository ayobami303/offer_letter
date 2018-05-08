import React, { Component } from 'react'
import { View, Text, ScrollView, Picker, StyleSheet, ActivityIndicator } from 'react-native'
import { FormLabel, FormInput, FormValidationMessage, Button } from 'react-native-elements'
import DatePicker from 'react-native-datepicker'
import soap from 'soap-everywhere'
import { Navigation } from "react-native-navigation";


const opts = {
    precision: 0,
    separator: '.',
    delimiter: ',',
    unit: '₦',
    //unit: opts.unit && (opts.unit.replace(/[\s]/g,'') + " ") || "",
    suffixUnit: '',
    zeroCents: false,
    moneyPrecision: 0
};

const amountFormatter = (amount) => {
    if (!amount) return '';

    const number = amount.toString().replace(/[\D]/g, '');
    const clearDelimiter = new RegExp(`^(0|\\${opts.delimiter})`);
    const clearSeparator = new RegExp(`(\\${opts.separator})$`);
    let money = number.substr(0, number.length - opts.moneyPrecision);
    let masked = money.substr(0, money.length % 3);
    const cents = new Array(opts.precision + 1).join('0');

    money = money.substr(money.length % 3, money.length);
    for (let i = 0, len = money.length; i < len; i++) {
        if (i % 3 === 0) {
            masked += opts.delimiter;
        }
        masked += money[i];
    }
    masked = masked.replace(clearDelimiter, '');
    masked = masked.length ? masked : '0';

    const unitToApply = opts.unit[opts.unit.length - 1] === ' ' ?
        opts.unit.substring(0, opts.unit.length - 1)
        :
        opts.unit;
    const output = unitToApply + masked + opts.separator + cents + opts.suffixUnit;
    return output.replace(clearSeparator, '');
};

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
    dd = '0' + dd
}

if (mm < 10) {
    mm = '0' + mm
}

today = yyyy + '-' + mm + '-' + dd;

class FormScreen extends Component{
    constructor(props){
        super(props)

        this.state = {
            productList: [],
            isProductLoading: true,
            isLoading: false,
            firstname:'',
            surname: '',
            product: 'select',
            salaryDate: today,
            tenor: 'select',
            email: '',
            amount: '',
            address: '',
            isValidEmail: false,
            firstnameError: '',
            surnameError: '',
            productError: '',
            salaryDateError: '',
            tenorError: '',
            emailError: '',
            amountError: '',
            addressError: ''
        }

        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this))
    }

    static navigatorButtons = {
        rightButtons: [
           { 
               title: 'logout',
                id: 'logout',
                buttonFontSize: 14,
                buttonFontWeight: 'bold'
            }
        ]
    }

    onNavigatorEvent(event){
        if(event.type == 'NavBarButtonPress'){
            if (event.id == 'logout') {                
                // alert("logout pressed")
                this.props.navigator.pop({
                    animated: true,
                    animationType: 'fade', 
                })
            }    
        }
    }


    componentDidMount(){
        this.get_product();
    }

    get_product = () =>{
        const args = {
            ProductName: ''
        }

        const thiss = this
        soap.createClient('https://infolink.pagemfbank.com:6699/offer_service.php?wsdl', function(err, client) {
            client.GetProducts(args, function(err, result) {
                // alert(JSON.stringify(result));
                const ProductName = result.ProductName
                const productArray = ProductName.split(",");
                
                const productList = [];
                productArray.forEach(element => {
                    productList.push(<Picker.Item label={element} value={element} key={element} />)
                });
                
                thiss.setState(prevState => ({
                    productList: [...thiss.state.productList, productList],
                    isProductLoading: false
                }))
            });
        });
    }

    create_offer_letter = () =>{
        const { firstname, surname, product, salaryDate, tenor, email, isValidEmail, amount, address } = this.state
        
        const args = {
            surname: surname,
            firstname: firstname,
            address: address,
            amount: amount,
            tenure: tenor,
            start_date: salaryDate,
            product: product,
            email: email
        }

        const thiss = this
        soap.createClient('https://infolink.pagemfbank.com:6699/offer_service.php?wsdl', function (err, client) {
            client.CreateOfferLetter(args, function (err, result) {
                // alert(JSON.stringify(result));
                if (result.Status == 'true') {
                    thiss.setState({
                        firstname: '',
                        surname: '',
                        product: 'select',
                        salaryDate: today,
                        tenor: 'select',
                        email: '',
                        amount: '',
                        address: '',
                        isValidEmail: false,
                    })
                    alert("Offer Letter Submitted Successfully.")
                }else{
                    alert("Something went wrong pls try again shortly.")
                }

                thiss.setState({
                    isLoading: false
                })
            });
        });
    }

    onFirstnameChange = (text) =>{
        if (text.trim() === '') {
            this.setState({ firstnameError: 'firstname can not be blank' })
        }else{
            this.setState({ firstnameError: '' })
            // alert(text)
        }
        this.setState({firstname: text})
    }

    onSurnameChange = (text) =>{
        if (text.trim() === '') {
            this.setState({ surnameError: 'surname can not be blank' })
        } else {
            this.setState({ surnameError: '' })
        }
        this.setState({ surname: text })
    }

    onProductChange = (text) =>{
        if (text.trim() === 'select') {
            this.setState({ productError: 'pls select a product' })
        } else {
            this.setState({ productError: '' })
        }
        this.setState({ product: text })
    }

    onTenorChange = (text) =>{
        if (text.toString() === 'select') {
            this.setState({ tenorError: 'pls select a tenor' })
        } else {
            this.setState({ tenorError: '' })
        }
        this.setState({ tenor: text })
    }

    onEmailChange = (text) => {
        if (text.trim() === '') {
            this.setState({ emailError: 'email address can not be blank', isValidEmail: false })
        } else {
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (re.test(String(text).toLowerCase())){
                this.setState({ emailError: '', isValidEmail: true })
            }else{
                this.setState({ emailError: 'pls enter a valid email address', isValidEmail: false })                
            }
            
        }
        this.setState({ email: text.trim() })
    }

    onAmountChange = (text) => {
        if (text.trim() === '') {
            this.setState({ amountError: 'amount can not be blank' })
        } else {
            this.setState({ amountError: '' })
        }
        this.setState({ amount: amountFormatter(text.trim()) })
        const {amount} = this.state
        const formattedAmount = amount.toString().replace('₦', '')
        // alert(formattedAmount.split(',').join(''))
    }

    onAddressChange = (text) => {
        if (text.trim() === '') {
            this.setState({ addressError: 'house address can not be blank' })
        } else {
            this.setState({ addressError: '' })
        }
        this.setState({ address: text })
    }

    onSubmit(){
        const { firstname, surname, product, salaryDate, tenor, email, isValidEmail, amount, address} = this.state

        if (firstname === '') {
            this.setState({ firstnameError: 'firstname can not be blank' })            
        }

        if (surname === '') {
            this.setState({ surnameError: 'surname can not be blank' })
        }

        if (product === 'select') {
            this.setState({ productError: 'pls select a product' })
        }

        if (tenor === 'select') {
            this.setState({ tenorError: 'pls select a tenor' })
        }

        if (email === '') {
            this.setState({ emailError: 'email can not be blank' })
        }
        
        if (amount === '') {
            this.setState({ amountError: 'amount can not be blank' })
        }

        if (address === '') {
            this.setState({ addressError: 'address can not be blank' })
        }

        if (firstname !== '' && surname !== '' && product !== 'select' && salaryDate !== '' && 
            tenor !== 'select' && email !== '' && isValidEmail && amount !== '' && address !== '') {
                this.create_offer_letter();
                this.setState({
                    isLoading: true
                })
            // alert("firstname: " + firstname + '\nsurname: ' + surname + '\nproduct type: ' + product
            //         + '\nsalary date: ' + salaryDate + '\ntenor: ' + tenor + '\nemail: ' + email + '\namount: ' + amount + '\naddress: ' + address )            
        }else{
            alert("Pls fill all specified field correctly.")
        }
    }

    render(){
        const itemArray = [];

        for (let i = 1; i < 37; i++) {            
            itemArray.push(<Picker.Item label= {i.toString()} value= {i} key = {i} />)
        }
        return(            
                this.state.isProductLoading ? 
                    <View style={styles.pIndicatorContainer} >
                        <ActivityIndicator style={styles.pIndicator} size="large" color="#f24d0c" />
                    </View> :  

                <View style = {styles.container} >                    
                    <ScrollView>
                        <View style ={styles.formContainer} >
                            <FormLabel>FIRSTNAME</FormLabel>
                            <FormInput 
                                value = {this.state.firstname}
                                placeholder = "FIRSTNAME" 
                                onChangeText = {(text) =>this.onFirstnameChange(text)}
                            />
                            <FormValidationMessage>{this.state.firstnameError}</FormValidationMessage>
                            
                            <FormLabel>SURNAME</FormLabel>
                            <FormInput 
                                value={this.state.surname}                            
                                placeholder = "SURNAME"
                                onChangeText = {(text) =>{this.onSurnameChange(text)}}    
                            />
                            <FormValidationMessage>{this.state.surnameError}</FormValidationMessage>
                            
                            <FormLabel>SELECT PRODUCT TYPE </FormLabel>
                            <View style = {styles.picker} >
                                <Picker
                                    selectedValue={this.state.product}
                                    style={{ height: 50, width: 300 }}
                                    onValueChange={(itemValue, itemIndex) => this.onProductChange(itemValue)}>
                                    <Picker.Item label="SELECT PRODUCT TYPE" value="select" />
                                    {this.state.productList}
                                </Picker>                        
                            </View>
                            <FormValidationMessage>{this.state.productError}</FormValidationMessage>
                            
                            <FormLabel>SELECT SALARY DATE </FormLabel>
                            <View style ={styles.datepicker} >
                                <DatePicker 
                                    style={{width: 300}}
                                    date={this.state.salaryDate}
                                    mode="date"
                                    placeholder="select date"
                                    format="YYYY-MM-DD"
                                    confirmBtnText="Confirm"
                                    cancelBtnText="Cancel"
                                    onDateChange={(date) => { this.setState({ salaryDate: date }) }}
                                />
                            </View>
                           
                            <FormLabel>SELECT TENOR</FormLabel>
                            <View style = {styles.picker} >
                                <Picker
                                    selectedValue={this.state.tenor}
                                    style={{ height: 50, width: 300 }}
                                    onValueChange={(itemValue, itemIndex) => this.onTenorChange(itemValue)}>
                                    <Picker.Item label="SELECT TENOR" value="select" />
                                    {itemArray}
                                </Picker>
                            </View> 
                            <FormValidationMessage>{this.state.tenorError}</FormValidationMessage>
                            
                            <FormLabel>EMAIL</FormLabel>
                            <FormInput 
                                value={this.state.email}
                                placeholder = "EMAIL" 
                                keyboardType = "email-address" 
                                onChangeText = {(text) =>this.onEmailChange(text)}
                            />
                            <FormValidationMessage>{this.state.emailError}</FormValidationMessage>

                            <FormLabel>LOAN AMOUNT</FormLabel>
                            <FormInput 
                                value={this.state.amount}
                                placeholder = "LOAN AMOUNT" 
                                keyboardType = "numeric"
                                value = {this.state.amount}
                                onChangeText = {(text) =>this.onAmountChange(text)}
                            />
                            <FormValidationMessage>{this.state.amountError}</FormValidationMessage>
                            
                            <FormLabel>HOUSE ADDRESS</FormLabel>
                            <FormInput 
                                value={this.state.address}
                                multiline = {true}
                                numberOfLines = {3}
                                placeholder = "HOUSE ADDRESS" 
                                onChangeText = {(text) =>this.onAddressChange(text)}
                            />
                            <FormValidationMessage>{this.state.addressError}</FormValidationMessage>
                         
                            <Button title= "SUBMIT" onPress = {this.onSubmit.bind(this)} buttonStyle = {styles.submitButton}/>
                        </View>
                    </ScrollView>       
                    {this.state.isLoading &&
                        <View style={styles.indicatorContainer} >
                            <ActivityIndicator style={styles.indicator} size="large" color="#f24d0c" />
                        </View>
                    }                      
                </View>
        )
    }
}

export default FormScreen;

const styles = StyleSheet.create({
    container:{
        flex:1
    },
    formContainer:{
        margin:20
    },
    picker:{
        backgroundColor: '#e5e5e5',
        margin: 15
    },
    datepicker:{
        margin: 15
    },
    submitButton:{
		marginTop: 20,
		borderRadius: 5,
		backgroundColor: '#f24d0c'
		// paddingTop:10	
    },
    pIndicatorContainer:{
        alignItems: 'center',
        flex:1,
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)'
    },
    pIndicator:{
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        padding: 10,
        borderRadius:5
    },
    indicatorContainer:{
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.5)',
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        left: 0,
        zIndex: 3
    },
    indicator:{
        backgroundColor: '#E5E5E5',
        alignSelf: 'center',
        padding: 10,
        borderRadius:5
    }
})