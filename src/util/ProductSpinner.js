import React, { Component } from "react";
import { View, Text, Picker } from "react-native";


class ProductSpinner extends Component{
    
    render(){
        return(
            <View>
                <Picker
                    selectedValue={this.props.product}
                    style={{ height: 50, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => this.props.onProductChange(itemValue, itemIndex)}>
                    <Picker.Item label="SELECT PRODUCT TYPE" value="select" />
                    {this.props.productList}
                </Picker>
            </View>
        )
    }
}


export default  ProductSpinner;