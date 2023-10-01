import { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import { AuthContext } from '../../shared/context/auth-context'
import { useForm } from '../../shared/hooks/form-hook'
import { useHttpClient } from '../../shared/hooks/http-hook'
import Input from '../../shared/components/FormElements/Input'
import Button from '../../shared/components/FormElements/Button'
import Card from '../../shared/components/UIElements/Card'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner'
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../shared/util/validators'
import './PlaceForm.css'

const UpdatePlace = () => {
  const [loadedPlace, setLoadedPlace] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const authCtx = useContext(AuthContext)
  const placeId = useParams().placeId
  const navigate = useNavigate()

  const [formState, inputHandler, setFormData] = useForm(
    {
      title: { value: '', isValid: false },
      description: { value: '', isValid: false },
    },
    false
  )

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:8000/api/places/${placeId}`
        )

        setLoadedPlace(responseData.place)
        setFormData(
          {
            title: { value: responseData.place.title, isValid: true },
            description: {
              value: responseData.place.description,
              isValid: true,
            },
          },
          true
        )
      } catch (err) {}
    }

    fetchPlace()
  }, [sendRequest, placeId, setFormData])

  /**
   *   Update Place
   */
  const placeUpdateSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      await sendRequest(
        `http://localhost:8000/api/places/${placeId}`,
        'PATCH',
        JSON.stringify({
          title: formState.inputs.title.value,
          description: formState.inputs.description.value,
        }),
        {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + authCtx.token,
        }
      )

      navigate(`/${authCtx.userId}/places`)
    } catch (err) {}
  }

  if (isLoading) {
    return (
      <div className='center'>
        <Card>
          <LoadingSpinner />
        </Card>
      </div>
    )
  }

  if (!loadedPlace && !error) {
    return (
      <div className='center'>
        <Card>
          <h2>Could not find the place.</h2>
        </Card>
      </div>
    )
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlace && (
        <form className='place-form' onSubmit={placeUpdateSubmitHandler}>
          <Input
            id='title'
            element='input'
            type='text'
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errorText='Please enter a valid title.'
            onInput={inputHandler}
            initialValue={loadedPlace.title}
            initialValid={true}
          />
          <Input
            id='description'
            element='textarea'
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errorText='Please enter a valid description (At least 5 charackters).'
            onInput={inputHandler}
            initialValue={loadedPlace.description}
            initialValid={true}
          />
          <Button type='submit' disabled={!formState.isValid}>
            Update Place
          </Button>
        </form>
      )}
    </>
  )
}

export default UpdatePlace
