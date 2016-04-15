import React from 'react'
import { connect } from 'react-redux'

import SignsViewer from '../components/SignsViewer'

import { createSign } from '../actions/signs'
import { fetchProjects } from '../actions/projects'

import '../style.css'

const mapStateToProps = (state, ownProps) => {
  return {
    activeFeeds: state.gtfsFilter.activeFeeds,
    allFeeds: state.gtfsFilter.allFeeds,
    signs: state.signs.all
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onComponentMount: (initialProps) => {
      console.log(initialProps)
      if (!initialProps.signs || initialProps.signs.length === 0) {
        console.log('fetching projects...')
        dispatch(fetchProjects())
      }

    },
    onStopClick: (stop, agency) => dispatch(createSign(stop, agency)),
    onRouteClick: (route, agency) => dispatch(createSign(route, agency)),
  }
}

const MainSignsViewer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SignsViewer)

export default MainSignsViewer
