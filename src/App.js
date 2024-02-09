import React, { Component } from "react";
import "./ClassComponent.css";
import video from "./videos/corona.mp4";

class ClassComponent extends Component {
  constructor() {
    super();
    this.state = {
      historicalData: [],
      currentPage: 1,
      entriesPerPage: 10,
    };
  }

  componentDidMount() {
    this.getHistoricalData();
  }

  getHistoricalData = async () => {
    try {
      const response = await fetch(
        "https://disease.sh/v3/covid-19/historical/all?lastdays=all"
      );
      const data = await response.json();
      const formattedData = this.formatData(data);
      this.setState({ historicalData: formattedData });
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  formatData = (data) => {
    const formattedData = [];
    for (let date in data.cases) {
      const row = {
        date,
        cases: data.cases[date],
        deaths: data.deaths[date],
        recovered: data.recovered[date],
      };
      formattedData.push(row);
    }
    return formattedData;
  };

  renderTableHeader() {
    return (
      <tr>
        <th>Date</th>
        <th className="cases">Cases</th>
        <th className="deaths">Deaths</th>
        <th className="recovered">Recovered</th>
      </tr>
    );
  }

  renderTableData() {
    const { historicalData, currentPage, entriesPerPage } = this.state;
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = historicalData.slice(
      indexOfFirstEntry,
      indexOfLastEntry
    );

    return currentEntries.map((row, index) => (
      <tr key={index}>
        <td className="datecolour">{row.date}</td>
        <td className="casecolour">{row.cases}</td>
        <td className="deathcolour">{row.deaths}</td>
        <td className="reccolour">{row.recovered}</td>
      </tr>
    ));
  }

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  renderPagination() {
    const { historicalData, currentPage, entriesPerPage } = this.state;
    const pageNumbers = Math.ceil(historicalData.length / entriesPerPage);

    return (
      <div className="pagination">
        {Array.from({ length: pageNumbers }).map((_, index) => (
          <button
            key={index}
            onClick={() => this.paginate(index + 1)}
            className={currentPage === index + 1 ? "active" : ""}
          >
            {index + 1}
          </button>
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <video autoPlay loop muted>
          <source src={video} type="video/mp4" />
        </video>
        <div className="container">
          <h1>COVID-19 Historical Data</h1>
          <table align="center" className="data-table">
            <thead>{this.renderTableHeader()}</thead>
            <tbody>{this.renderTableData()}</tbody>
          </table>
                   
        </div>
        <div>
        <table>
          {this.renderPagination()}
          </table>

        </div>
      </div>
    );
  }
}

export default ClassComponent;
