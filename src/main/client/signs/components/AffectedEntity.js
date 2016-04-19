import React from 'react'
import moment from 'moment'

import { Panel, Row, Col, ButtonGroup, Button, Glyphicon, Input, DropdownButton, MenuItem } from 'react-bootstrap'

import GtfsSearch from '../../gtfs/components/gtfssearch'

import modes from '../modes'

import { getFeed } from '../../common/util/modules'

export default class AffectedEntity extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    const getRouteName = (route) => {
      let routeName = route.route_short_name && route.route_long_name ? `${route.route_short_name} - ${route.route_long_name}` :
        route.route_long_name ? route.route_long_name :
        route.route_short_name ? route.route_short_name : null
      return routeName
    }
    const getEntitySummary = (entity) => {
      const type = entity.type
      const val = entity[type.toLowerCase()]
      let agencyName = ''
      if (entity.agency) {
        agencyName = entity.agency.name
      }
      else if (entity.stop) {
        const feed = getFeed(this.props.feeds, entity.stop.feed_id)
        agencyName = typeof feed !== 'undefined' ? feed.name : 'Unknown agency'
      }

      const routes = entity.route ? ` for ${entity.route.length} routes`
                    : entity.route_id ? ` for ${entity.route_id.length} routes`
                    : ' [add routes]'
      let stopName = typeof entity.stop !== 'undefined' && entity.stop !== null ? `${entity.stop.stop_name} (${agencyName})` : entity.stop_id
      let summary = ''
        switch (type) {
          case 'STOP' :
            summary = stopName
            if (routes) {
              summary += routes
            }
            return summary
          default:
            return ''
        }
    }

    return (
      <Panel collapsible header={
        <Row>
          <Col xs={10}>
            <span><Glyphicon glyph="map-marker" /> {getEntitySummary(this.props.entity)}</span>
          </Col>
          <Col xs={2}>
            <ButtonGroup className='pull-right'>
              <Button bsSize="small" onClick={() => this.props.onDeleteEntityClick(this.props.entity)}>
                <Glyphicon glyph="remove" />
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      }>

        {(() => {
          var indent = {
            paddingLeft: '30px'
          }
          let selectedFeeds = [this.props.entity.agency] || this.props.activeFeeds
          console.log(selectedFeeds)
          let selectedRoute = this.props.entity.route
          let selectedStop = this.props.entity.stop
          console.log(selectedStop)
          switch (this.props.entity.type) {
            case "STOP":
              return (
                <div>
                  <span><b>Stop:</b></span>
                  <StopSelector
                    feeds={this.props.activeFeeds}
                    stop={this.props.entity.stop}
                    clearable={false}
                    entityUpdated={this.props.entityUpdated}
                    entity={this.props.entity}
                  />
                  <div style={indent}>
                    <span><i>Refine by Route:</i></span>
                    <RouteSelector
                      feeds={selectedFeeds}
                      minimumInput={0}
                      filterByStop={selectedStop}
                      route={this.props.entity.route}
                      entityUpdated={this.props.entityUpdated}
                      entity={this.props.entity}
                    />
                  </div>
                </div>
              )
          }
        })()}

      </Panel>
    )
  }
}

class RouteSelector extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    console.log('render route ent', this.props.route)
    const getRouteName = (route) => {
      let routeName = route.route_short_name && route.route_long_name ? `${route.route_short_name} - ${route.route_long_name}` :
        route.route_long_name ? route.route_long_name :
        route.route_short_name ? route.route_short_name : null
      return routeName
    }
    var routes = []
    const feed = this.props.route ? getFeed(this.props.feeds, this.props.route.feed_id) : null
    const agencyName = feed ? feed.name : 'Unknown agency'

    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          limit={100}
          multi={true}
          minimumInput={this.props.minimumInput}
          filterByStop={this.props.filterByStop}
          clearable={this.props.clearable}
          entities={['routes']}
          onChange={(evt) => {
            console.log(evt)
            if (evt) {
              let routes = evt.map(e => e.route)
              this.props.entityUpdated(this.props.entity, "ROUTES", routes)
            }
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "ROUTES", [])
          }}
          value={this.props.route ? this.props.route.map(r => ({'route': r, 'value': r.route_id, 'label': `${getRouteName(r)}`})) : ''}
        />
      </div>
    )
  }
}

class StopSelector extends React.Component {
  constructor (props) {
    super(props)
  }
  render () {
    console.log('render stop ent', this.props.stop)
    var stops = []
    const feed = this.props.stop ? getFeed(this.props.feeds, this.props.stop.feed_id) : null
    const agencyName = feed ? feed.name : 'Unkown agency'
    return (
      <div>
        <GtfsSearch
          feeds={this.props.feeds}
          limit={100}
          minimumInput={this.props.minimumInput}
          filterByRoute={this.props.filterByRoute}
          entities={['stops']}
          clearable={this.props.clearable}
          onChange={(evt) => {
            if (typeof evt !== 'undefined' && evt !== null)
              this.props.entityUpdated(this.props.entity, "STOP", evt.stop, evt.agency)
            else if (evt == null)
              this.props.entityUpdated(this.props.entity, "STOP", null, null)
          }}
          value={this.props.stop ? {'value': this.props.stop.stop_id, 'label': `${this.props.stop.stop_name} (${agencyName})`} : ''}
        />

      </div>
    )
  }
}
