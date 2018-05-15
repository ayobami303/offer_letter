import React, { Component } from "react";
import { View, Text, Picker } from "react-native";


class TenorSpinner extends Component {

    render() {
        return (
            <View>
                <Picker
                    selectedValue={this.props.tenor}
                    style={{ height: 50, width: 300 }}
                    onValueChange={(itemValue, itemIndex) => this.props.onTenorChange(itemValue)}>
                    <Picker.Item label="SELECT TENOR" value="select" />
                    {this.props.tenorList}
                </Picker>
            </View>
        )
    }
}


export default TenorSpinner;