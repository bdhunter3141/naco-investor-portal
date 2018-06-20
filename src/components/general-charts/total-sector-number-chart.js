import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import axios from 'axios'
import axiosHeaders from '../../axios-headers'

export default class TotalSectorNumberChart extends Component {

  state = {
    totalSectorNumberLabels: [],
    totalSectorNumberData: []
  }



  componentDidMount() {

    // GET COUNT OF DEAL NUMBERS

    axiosHeaders.generateHeaders().then((headers) => {
      axios('/.netlify/functions/get', {
        method: 'GET',
        headers,
        params: { path: "rest/v2/tables/Deals/records", select: { 0: 'Deal_MajorSector', 1: 'COUNT(Deal_DealRef)%20AS%20totalSectorNumber' }, where: { Group_NameAndSubmissionYear: { query: '%252017%25', type: '%20LIKE%20' } }, groupBy: 'Deal_MajorSector' }
      }
      )
        .then(res => {
          let sectors = [];
          res.data.Result.forEach(sector => {
            if (sector.Deal_MajorSector !== '' && sector.Deal_MajorSector !== 'Other') {
              sectors.push({ label: sector.Deal_MajorSector, totalSectorNumber: sector.totalSectorNumber, indvInvestorTotalSectorNumber: 0 })
            }
          });

          // GET COUNT OF DEALS FROM INDIVIDUAL INVESTORS
          axios('/.netlify/functions/get', {
            method: 'GET',
            headers,
            params: { path: "rest/v2/tables/IndvInvestorDeals/records", select: { 0: 'IndvInvestor_CompanyMajorSector', 1: 'COUNT(IndvInvestor_DealRef)%20AS%20indvInvestorTotalSectorNumber' }, where: { IndvInvestor_Email_Year: { query: '%252017%25', type: '%20LIKE%20' } }, groupBy: 'IndvInvestor_CompanyMajorSector' }
          }
          )
            .then(res => {
              console.log(res)
              res.data.Result.forEach(indvInvestorSector => {
                sectors.forEach(sector => {
                  if (indvInvestorSector.IndvInvestor_CompanyMajorSector.toLowerCase() === sector.label.toLowerCase()) {
                    sector.indvInvestorTotalSectorNumber = indvInvestorSector.indvInvestorTotalSectorNumber
                  }
                })
              });
              let totalSectorNumberLabels = []
              let totalSectorNumberData = []
              sectors.forEach(sector => {
                //SET STATE WITH LIST OF LABELS
                totalSectorNumberLabels.push(sector.label)
                //SET STATE WITH SUM OF DEAL NUMBERS
                totalSectorNumberData.push(sector.indvInvestorTotalSectorNumber + sector.totalSectorNumber)
              })
              this.setState({ totalSectorNumberLabels: totalSectorNumberLabels })
              this.setState({ totalSectorNumberData: totalSectorNumberData })
            })
            .catch(error => {
              throw error;
            })
        })
        .catch(error => {
          throw error
        })
    })
      .catch(error => {
        console.log(error)
      })

  }

  render() {
    const data = {
      labels: this.state.totalSectorNumberLabels,
      datasets: [{
        label: 'Total Sector (#)',
        data: this.state.totalSectorNumberData,
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
    return (
      <Bar
        data={data}
        width={100}
        height={50}
      />
    )
  }

}