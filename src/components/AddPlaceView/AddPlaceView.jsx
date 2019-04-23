/* global daum */

import React, { Component } from 'react';
import classNames from 'classnames/bind';

import { withMap } from '../../contexts/MapContext';
import styles from './AddPlaceView.scss';

const cx = classNames.bind(styles);

class AddPlaceView extends Component {
  state = {
    inputValue: '',
  };

  handleChange = e => {
    this.setState({
      inputValue: e.target.value,
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    const ps = new daum.maps.services.Places();
    const map = this.props.map;
    let markers = [];

    searchPlaces(this.state.inputValue);

    // 키워드 검색을 요청하는 함수입니다
    function searchPlaces(inputValue) {
      let keyword = inputValue;

      if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
      }

      // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
      ps.keywordSearch(keyword, placesSearchCB);
    }

    // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
    function placesSearchCB(data, status, pagination) {
      if (status === daum.maps.services.Status.OK) {
        console.log(data);
        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data);
        // 페이지 번호를 표출합니다
        // displayPagination(pagination);
      } else if (status === daum.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 존재하지 않습니다.');
        return;
      } else if (status === daum.maps.services.Status.ERROR) {
        alert('검색 결과 중 오류가 발생했습니다.');
        return;
      }
    }

    // 검색 결과 목록과 마커를 표출하는 함수입니다
    function displayPlaces(places) {
      let listEl = document.querySelector('.placeSearchList');
      let bounds = new daum.maps.LatLngBounds();
      let listStr = '';

      // 검색 결과 목록에 추가된 항목들을 제거합니다
      removeAllChildNods(listEl);

      // 지도에 표시되고 있는 마커를 제거합니다
      removeMarker();

      for (let i = 0; i < places.length; i++) {
        // 마커를 생성하고 지도에 표시합니다
        let placePosition = new daum.maps.LatLng(places[i].y, places[i].x);
        let marker = new daum.maps.Marker({
          map,
          position: placePosition,
        });
        let itemEl = getListItem(i, places[i]); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        //   (function(marker, title) {
        //     daum.maps.event.addListener(marker, 'mouseover', function() {
        //       displayInfowindow(marker, title);
        //     });

        //     daum.maps.event.addListener(marker, 'mouseout', function() {
        //       infowindow.close();
        //     });

        //     itemEl.onmouseover = function() {
        //       displayInfowindow(marker, title);
        //     };

        //     itemEl.onmouseout = function() {
        //       infowindow.close();
        //     };
        //   })(marker, places[i].place_name);

        //   fragment.appendChild(itemEl);
        // }

        // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
        listEl.appendChild(itemEl);
        listEl.scrollTop = 0;

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
        map.setBounds(bounds);
      }

      // 검색결과 목록의 자식 Element를 제거하는 함수입니다
      function removeAllChildNods(el) {
        while (el.hasChildNodes()) {
          el.removeChild(el.lastChild);
        }
      }

      // 지도 위에 표시되고 있는 마커를 모두 제거합니다
      function removeMarker() {
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }
        markers = [];
      }

      // 검색결과 항목을 Element로 반환하는 함수입니다
      function getListItem(index, places) {
        var el = document.createElement('li'),
          itemStr =
            '<span class="markerbg marker_' +
            (index + 1) +
            '"></span>' +
            '<div class="info">' +
            '   <h5>' +
            places.place_name +
            '</h5>';

        if (places.road_address_name) {
          itemStr +=
            '    <span>' +
            places.road_address_name +
            '</span>' +
            '   <span class="jibun gray">' +
            places.address_name +
            '</span>';
        } else {
          itemStr += '    <span>' + places.address_name + '</span>';
        }

        itemStr += '  <span class="tel">' + places.phone + '</span>' + '</div>';

        el.innerHTML = itemStr;
        el.className = 'item';

        return el;
      }
    }
  };

  render() {
    const { isPlaceSearchOpen, handlePlaceSearchMenu } = this.props;
    const { inputValue } = this.state;
    return (
      <section
        className={cx('placeSearchSection', { open: isPlaceSearchOpen })}
      >
        <form onSubmit={e => this.handleSubmit(e)}>
          <fieldset>
            <legend className={cx('readableHidden')}>장소 검색</legend>
            <input
              type="search"
              className={cx('searchInput')}
              placeholder="등록할 장소를 검색하세요!"
              value={inputValue}
              onChange={e => this.handleChange(e)}
            />
            <button>검색</button>
          </fieldset>
        </form>
        <ul className={cx('placeSearchList')} />
        <a onClick={() => handlePlaceSearchMenu()}>닫기</a>
      </section>
    );
  }
}

export default withMap(AddPlaceView);