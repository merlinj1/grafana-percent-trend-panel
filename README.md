# Grafana Percent Trend Stat Panel

[![Build](https://github.com/nikos/grafana-percent-trend-panel/workflows/CI/badge.svg)](https://github.com/nikos/grafana-percent-trend-panel/actions?query=workflow%3A%22CI%22)

A panel for Grafana 7.0+ which computes and displays percent with trend compared to a previous value.

![Sample panel](./src/img/screenshots/panel-demo.png)

Configuration allows to display the percentage value compared to the base value plain or
interpret the percentage change as difference ("trend") with a colored (green/red) triangle symbol
to see the trend evolution easily.

The idea for this plugin panel was inspired by an article about [Embedded Analytics](https://www.revealbi.io/glossary/embedded-analytics).

## Install

Download the [latest release](https://github.com/nikos/grafana-percent-trend-panel/releases/download/v1.0.3/nikosc-percenttrend-panel-1.0.3.zip) and unzip it in your grafana plugin folder.

## Usage

1. Query two metrics, remember field names, which have to be specified in the next step

2. Select the field names of the query results and use them to display your percentage trend

   ![Configure details in panel options](./src/img/screenshots/panel-options.png)

## Develop and contribute

1. Install dependencies

   ```bash
   yarn install
   ```

2. Build plugin in development mode or run in watch mode

   ```bash
   yarn dev
   ```

   or

   ```bash
   yarn watch
   ```

3. Build plugin in production mode

   ```bash
   yarn build
   ```

## More resources

- [Grafana documentation](https://grafana.com/docs/)
- [Build a panel plugin tutorial](https://grafana.com/tutorials/build-a-panel-plugin)
- [Grafana percent+ stat panel](https://github.com/JeanBaptisteWATENBERG/grafana-percent-plus)
