import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import dashboardFunctions from '../../dashboard-functions'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class AverageInvestmentDollarChart extends Component {
  state = {
    averageInvestmentDollarLabels: [],
    averageInvestmentDollarData: [],
    isData: false,
    isLoading: true,
  }

  newData = (data, loading) => {
    let averageInvestmentDollarLabels = []
    let averageInvestmentDollarData = []
    for (let userOrAverage in data) {
      averageInvestmentDollarLabels.push(userOrAverage)
      averageInvestmentDollarData.push(Math.round(data[userOrAverage]))
    }
    this.setState({ isData: dashboardFunctions.checkForData(averageInvestmentDollarData) })
    this.setState({ averageInvestmentDollarLabels: averageInvestmentDollarLabels })
    this.setState({ averageInvestmentDollarData: averageInvestmentDollarData })
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
      labels: this.state.averageInvestmentDollarLabels,
      datasets: [{
        label: 'Investment Amount ($)',
        data: this.state.averageInvestmentDollarData,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
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
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Average Investment Amount ($)'
      },
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
        return (<Bar
          data={data}
          width={100}
          height={50}
          options={options}
        />)
      } else {
        return (<div className="no-data">
          <FontAwesomeIcon icon="chart-bar" size="10x" />
          <p>No Data Available</p>
        </div>)
      }
    }

    return (
      graphOrPlaceholder(this.state.isData, this.state.isLoading)
    )
  }

}