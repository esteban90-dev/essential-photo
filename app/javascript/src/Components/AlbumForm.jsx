import React from 'react';
import './AlbumForm.css';
import ModalLayout from '../Layouts/ModalLayout';
import xIcon from '../images/x-icon.svg';
import {
  BASE_URL,
  POST_ALBUMS_ENDPOINT,
  UPDATE_ALBUMS_ENDPOINT
} from '../settings';

export default function AlbumForm(props) {
  const [albumName, setAlbumName] = React.useState(getAlbumName());

  let errors = [];

  if (props.albumFetchResults.length > 0) {
    if (props.albumFetchResults[0].responseStatus > 400) {
      errors = props.albumFetchResults[0].responseBody.map(errorMessage => 
        <p className="formSubmitErrorMessage">{errorMessage}</p>
      );
    }
  }

  function getAlbumName() {
    if (props.album) {
      return props.album.name;
    }
    else {
      return '';
    }
  }

  function handleChange(event) {
    setAlbumName(prevName => event.target.value);
  }

  function handleXClick(event) {
    event.stopPropagation();
    props.close();
  }

  function handleSubmit(event) {
    event.preventDefault();

    // build a formData object
    const formData = new FormData();
    formData.append('name', albumName);
    formData.append('parent_album_id', props.selectedAlbumId);

    if (props.album) {
      // update album
      props.setAlbumFetchParameters({
        url: `${BASE_URL}${UPDATE_ALBUMS_ENDPOINT}/${props.album.id}`,
        method: 'PATCH',
        bodies: [formData],
      });
    }
    else {
      // create new album
      props.setAlbumFetchParameters({
        url: `${BASE_URL}${POST_ALBUMS_ENDPOINT}`,
        method: 'POST',
        bodies: [formData],
      });
    }    
  }

  return (
    <ModalLayout close={props.close}>
      <div
        className="albumForm"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="albumForm__title">
          {props.album ? 'Edit Album' : 'New Album'}
        </h2>
        <img
          src={xIcon}
          className="albumForm__closeIcon"
          onClick={handleXClick}
          alt="this is an X icon"
        ></img>
        <form 
          className="albumForm__form"
          onSubmit={handleSubmit}
        >
          <label htmlFor="name">
            Name:
          </label>
          <input 
            type="text"
            id="name"
            name="name"
            onChange={handleChange}
            value={albumName}
          ></input>

          {errors.length > 0 && errors}

          <button
            type="submit"
            className="button"
          >
            {props.album ? 'Update Album' : 'Create Album'}
          </button>
        </form>
      </div>
    </ModalLayout>
  )
}