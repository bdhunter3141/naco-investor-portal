import React, { Component } from 'react'
import axios from 'axios'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import Toggle from 'material-ui/Toggle'
import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import submissionFunctions from '../submission-functions'
import axiosHeaders from '../axios-headers'
import { navigateTo, Link } from "gatsby-link"

const provinceOptions = ['AB', 'BC', 'MB', 'NB', 'NL', 'NT', 'NS', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT', 'N/A']

export default class MyProfile extends Component {

  state = {
    IndvInvestor_FirstName: "",
    IndvInvestor_LastName: "",
    IndvInvestor_Email: "",
    IndvInvestor_Address1: "",
    IndvInvestor_Address2: "",
    IndvInvestor_City: "",
    IndvInvestor_Province: "",
    IndvInvestor_PostCode: "",
    IndvInvestor_GeographicFocus: "",
    IndvInvestor_OtherGeograhicFocus: "",
    IndvInvestor_PartOfGroup: false,
    IndvInvestor_GrpMembership: [],
    IndvInvestor_GrpMembershipCustom: "",
    importedLists: {
      angelGroupNames: ['Loading...'],
      angelGroupNumbers: []
    },
  }

  listsToState(originalList, stateName, stateNumber) {
    let listNames = []
    let listNumbers = []
    for (let listItem of originalList) {
      listNames.push(listItem.value)
      listNumbers.push(listItem.number)
    }
    const importedLists = { ...this.state.importedLists }
    importedLists[stateName] = listNames
    importedLists[stateNumber] = listNumbers
    this.setState({ importedLists })
  }

  componentDidMount() {

    axiosHeaders.generateHeaders().then((headers) => {
      axios('/.netlify/functions/get', {
        method: 'GET',
        headers,
        params: { path: `rest/v2/tables/IndvInvestorDetails/records`, where: { userSpecific: true } }
      }
      )
        .then(res => {
          console.log(res)
          const resProfile = res.data.Result[0];
          const oldState = this.state;
          const newState = oldState;
          newState.IndvInvestor_Email = resProfile.IndvInvestor_Email
          newState.IndvInvestor_Address1 = resProfile.IndvInvestor_Address1
          newState.IndvInvestor_Address2 = resProfile.IndvInvestor_Address2
          newState.IndvInvestor_City = resProfile.IndvInvestor_City
          newState.IndvInvestor_FirstName = resProfile.IndvInvestor_FirstName
          newState.IndvInvestor_LastName = resProfile.IndvInvestor_LastName
          newState.IndvInvestor_GeographicFocus = resProfile.IndvInvestor_GeographicFocus
          newState.IndvInvestor_OtherGeograhicFocus = resProfile.IndvInvestor_OtherGeograhicFocus
          newState.IndvInvestor_GrpMembershipCustom = resProfile.IndvInvestor_GrpMembershipCustom
          newState.IndvInvestor_PostCode = resProfile.IndvInvestor_PostCode
          newState.IndvInvestor_Province = resProfile.IndvInvestor_Province


          if (resProfile.IndvInvestor_PartOfGroup === "Yes") {
            newState.IndvInvestor_PartOfGroup = true
          } else {
            newState.IndvInvestor_PartOfGroup = false
          }

          if (resProfile.IndvInvestor_GrpMembership) {
            let angelGroupNames = []
            for (let angelGroup in resProfile.IndvInvestor_GrpMembership) {
              angelGroupNames.push(resProfile.IndvInvestor_GrpMembership[angelGroup])
            }
            newState.IndvInvestor_GrpMembership = angelGroupNames
          }
          this.setState(newState)
        })
        .catch(error => {
          throw error
        })
    })
      .catch(error => {
        console.log(error)
      })

    // GET ANGEL GROUP NAMES

    axiosHeaders.generateHeaders().then((headers) => {
      axios('/.netlify/functions/get', {
        method: 'GET',
        headers,
        params: { path: "rest/v2/tables/IndvInvestorDetails/fields/IndvInvestor_GrpMembership" }
      }
      )
        .then(res => {
          let angelGroupArray = submissionFunctions.createResponseList(res)
          submissionFunctions.moveToEndOfList('Other', angelGroupArray)
          this.listsToState(angelGroupArray, 'angelGroupNames', 'angelGroupNumbers')
        })
        .catch(error => {
          throw error
        })
    })
      .catch(error => {
        console.log(error)
      })
  }


  handleDropdownChange = (event, index, value) => {
    const target = event.target
    const name = target.parentNode.parentNode.parentNode.attributes[0].nodeValue
    this.setState({ [name]: value })
  }

  handleToggle = (event, isInputChecked) => {
    const name = event.target.name
    this.setState({ [name]: isInputChecked })
  }

  handleChange = event => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const error = `${name}Error`
    this.setState({ [error]: "" })
    if (value.trim() === '') {
      this.setState({ [error]: "Please enter a value." })
    }
    this.setState({ [name]: value })
  }

  menuItems(values, array, menuName) {
    return array.map(i => (
      <MenuItem
        key={i}
        insetChildren={true}
        checked={values && values.indexOf(i) > -1}
        value={i}
        primaryText={i}
        name={menuName}
      />
    ))
  }


  handleSubmit = event => {
    event.preventDefault()
    let {
      IndvInvestor_Address1,
      IndvInvestor_Address2,
      IndvInvestor_City,
      IndvInvestor_Province,
      IndvInvestor_PostCode,
      IndvInvestor_GeographicFocus,
      IndvInvestor_OtherGeograhicFocus,
      IndvInvestor_PartOfGroup,
      IndvInvestor_GrpMembership,
      IndvInvestor_GrpMembershipCustom } = this.state

    IndvInvestor_GrpMembership = submissionFunctions.findListNumber(IndvInvestor_GrpMembership, this.state.importedLists.angelGroupNames, this.state.importedLists.angelGroupNumbers)
    IndvInvestor_PartOfGroup = submissionFunctions.toggleSubmit(IndvInvestor_PartOfGroup)

    const dealSubmission = {
      IndvInvestor_Address1,
      IndvInvestor_Address2,
      IndvInvestor_City,
      IndvInvestor_Province,
      IndvInvestor_PostCode,
      IndvInvestor_GeographicFocus,
      IndvInvestor_OtherGeograhicFocus,
      IndvInvestor_PartOfGroup,
      IndvInvestor_GrpMembership,
      IndvInvestor_GrpMembershipCustom
    }

    console.log(dealSubmission)

    // axiosHeaders.generateHeaders().then((headers) => {
    //   axios('/.netlify/functions/put', {
    //     method: 'PUT',
    //     headers,
    //     data: dealSubmission,
    //     params: { path: "rest/v2/tables/IndvInvestorDetails/records", userSpecific: true }
    //   }
    //   )
    //     .catch(error => {
    //       throw error
    //     })
    // })
    //   .then(() => {
    //     navigateTo('/personal-dashboard')
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })

  }


  styles = {
    width: '450px',
  }


  render() {

    return (
      <div>
        <h1>Profile</h1>
        <p>Update your profile using the fields below.</p>
        <div className="form-container">
          <h2>Personal</h2>
          <hr />
          <TextField
            underlineDisabledStyle={{ 'border-style': 'none' }}
            disabled={true}
            hintText="Enter your first name"
            name="IndvInvestor_FirstName"
            floatingLabelText="First Name"
            onChange={this.handleChange}
            floatingLabelFixed={true}
            style={{
              width: '450px',
              cursor: 'default'
            }}
            errorText={this.state.IndvInvestor_FirstNameError}
            value={this.state.IndvInvestor_FirstName}
          />
          <br />


          <h2>Address</h2>
          <hr />
          <SelectField
            floatingLabelFixed={true}
            floatingLabelText="Province"
            value={this.state.IndvInvestor_Province}
            onChange={this.handleDropdownChange}
            style={this.styles}
            hintText="-- Select --"
            labelStyle={this.styles}
          >
            {provinceOptions.map(i => (
              <MenuItem
                key={i}
                value={i}
                primaryText={i}
                name='IndvInvestor_Province'
              />
            ))}
          </SelectField>
          <br />

          <h2>Focus / Group Membership</h2>
          <hr />
          <br />

          <Toggle
            label="Are you an Angel Group Member?"
            name="IndvInvestor_PartOfGroup"
            onToggle={this.handleToggle}
            style={this.styles}
            toggled={this.state.IndvInvestor_PartOfGroup}
          />
          <SelectField
            floatingLabelFixed={true}
            floatingLabelText="What Angel Group do you belong to?"
            value={this.state.IndvInvestor_GrpMembership}
            onChange={this.handleDropdownChange}
            style={this.styles}
            multiple={true}
            hintText="-- Select all that apply --"
            labelStyle={this.styles}
            errorText={this.state.IndvInvestor_GrpMembershipError}
          >
            {this.menuItems(
              this.state.IndvInvestor_GrpMembership,
              this.state.importedLists.angelGroupNames,
              'IndvInvestor_GrpMembership'
            )}
          </SelectField>
          <br />
          <TextField
            hintText="Please Specify the Angel Group name"
            name="IndvInvestor_GrpMembershipCustom"
            floatingLabelText="Other Angel Group Name"
            onChange={this.handleChange}
            floatingLabelFixed={true}
            style={this.styles}
            errorText={this.state.IndvInvestor_GrpMembershipCustomError}
            value={this.state.IndvInvestor_GrpMembershipCustom}
          />

          <br />
          <br />
          <RaisedButton
            label="Update"
            primary={true}
            onClick={this.handleSubmit}
          />
        </div>
      </div>
    )
  }
}