import React, { Component } from 'react'
import { Doughnut } from 'react-chartjs-2';
import dashboardFunctions from '../../dashboard-functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class InvestmentNumberChart extends Component {

  state = {
    investmentNumberLabels: [],
    investmentNumberData: [],
    isData: false,
    isLoading: true,
  }

  newData = (data, loading) => {
    let investmentNumberLabels = []
    let investmentNumberData = []
    for (let newFollowOn in data) {
      if (newFollowOn === 'newNumbers') {
        investmentNumberLabels.push('New')
      }
      if (newFollowOn === 'followOnNumbers') {
        investmentNumberLabels.push('Follow On')
      }
      investmentNumberData.push(Math.round(data[newFollowOn]))
    }
    this.setState({ isData: dashboardFunctions.checkForData(investmentNumberData) })
    this.setState({ investmentNumberLabels: investmentNumberLabels })
    this.setState({ investmentNumberData: investmentNumberData })
    if (!loading) {
      this.setState({ isLoading: false })
    }
  }

  componentDidMount() {
    this.newData(this.props.data, true)

  }

  componentWillReceiveProps(newProps) {
    this.newData(newProps.data, newProps.isLoading)
  }


  render() {
    const data = {
      labels: this.state.investmentNumberLabels,
      datasets: [{
        label: 'Your Total Number of Investments (#)',
        data: this.state.investmentNumberData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1
      }]
    }

    const options = {
      layout: {
        padding: {
          left: 30,
          right: 30,
          top: 30,
          bottom: 30
        }
      },
      title: {
        display: true,
        text: 'Your Total Number of Investments (#)'
      },
      legend: {
        position: 'bottom'
      }
    }


    const graphOrPlaceholder = (dataPresent, loading) => {
      if (loading) {
        return (<div className="graph-loader">
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div>)
      } else if (dataPresent) {
        return (<Doughnut
          data={data}
          width={100}
          height={50}
          options={options}
        />)
      } else {
        return (<div className="no-data">
          <FontAwesomeIcon icon="chart-pie" size="8x" />
          <p style={ { marginTop: '15px'}}>No Data Available</p>
        </div>)
      }
    }

    return (
      graphOrPlaceholder(this.state.isData, this.state.isLoading)
    )
  }

}