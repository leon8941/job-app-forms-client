import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import _ from 'lodash';

import './App.css';
import { FileUploader } from "react-drag-drop-files";
import { fetchJobs, fetchLocations, fetchHeardFroms, submitJobApplication } from './api/jobApplications';

import { Modal } from './components/modal'

function App() {
  const [jobs, setJobs] = useState<{id: number, title: string}[]>([])
  const [locations, setLocations] = useState<{id: number, name: string}[]>([])
  const [heardFroms, setHeardFroms] = useState<{key: string, name: string}[]>([])
  const [showModal, setShowModal] = useState(false)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [previewFileName, setPreviewFileName] = useState<string | null>(null)

  useEffect(() => {
    fetchJobs().then(response => {
      setJobs(response)
    })

    fetchLocations().then(response => {
      setLocations(response)
    })

    fetchHeardFroms().then(response => {
      setHeardFroms(response)
    })
  }, [])

  const onModalCloseHandler = () => {
    setShowModal(false)
  }

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      contactNo: '',
      addressLine1: '',
      addressLine2: '',
      job: '',
      noOfYearExp: '',
      prefferedLocation: '',
      heardFrom: '',
      noticePeriod: '',
      file: null,
    },
    validationSchema: Yup.object({
      firstName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('First Name is Required'),
      lastName: Yup.string()
        .max(15, 'Must be 15 characters or less')
        .required('Last Name is Required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is Required'),
      contactNo: Yup.string().required('Contact No. is Required'),
      addressLine1: Yup.string()
        .max(100, 'Must be 15 characters or less')
        .required('Address Line 1 is Required'),
      addressLine2: Yup.string()
        .max(100, 'Must be 15 characters or less')
        .required('Address Line 2 is Required'),
      job: Yup.number().required('Job is Required'),
      noOfYearExp: Yup.number().required('No Of Years Experience is Required'),
      prefferedLocation: Yup.number().required('Preferred Location is Required'),
      heardFrom: Yup.string().required('Heard from is Required'),
      noticePeriod: Yup.number().required('Notice Period is Required'),
      file: Yup.string().required('Resume Required').nullable()
    }),
    onSubmit: async (values, actions) => {
      actions.setSubmitting(true)
      const response = await submitJobApplication({
        ...values,
        fileName: previewFileName
      })

      if (response == 200) {
        actions.resetForm({
          values: {
            firstName: '',
            lastName: '',
            email: '',
            contactNo: '',
            addressLine1: '',
            addressLine2: '',
            job: '',
            noOfYearExp: '',
            prefferedLocation: '',
            heardFrom: '',
            noticePeriod: '',
            file: null,
          }
        })
        actions.setSubmitting(false)
        setShowModal(true)
        setPreviewFile(null)
        setPreviewFileName(null)
        setFieldValue('file', null);
      }
    }
  })

  const {
    setFieldValue,
  } = formik;

  const handleFileChange = (file: File) => {
    setFieldValue('file', file);
    setPreviewFile(URL.createObjectURL(file));
    setPreviewFileName(file.name);
  };
  
  return (
    <div>
      <>
        {
          showModal ? <Modal 
            content='Successfully submit job application'
            onCloseClick={onModalCloseHandler}
          /> : null
        }
        <div>
          <div className="md:grid md:grid-cols-3 md:gap-6">
            <div className="mt-5 md:mt-0 md:col-span-3">
              <form onSubmit={formik.handleSubmit}>
                <div className="shadow sm:rounded-md sm:overflow-hidden">
                  <div className="px-4 py-5 bg-white space-y-6 sm:p-6">
                    <h1 className="text-2xl font-semibold leading-6 text-gray-900">Job Application Form</h1>
                    <div className="grid grid-cols-6 gap-6">
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                          First Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="John"
                            onChange={formik.handleChange}
                            value={formik.values.firstName}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.firstName ? <div>{formik.errors.firstName}</div> : null}  
                          </div>
                        }
                      </div>
                      <div className="col-span-6 sm:col-span-3">
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                          Last Name
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            placeholder="Cena"
                            onChange={formik.handleChange}
                            value={formik.values.lastName}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.lastName ? <div>{formik.errors.lastName}</div> : null}  
                          </div>
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="email"
                            name="email"
                            id="email"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="johncena@email.com"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.email ? <div>{formik.errors.email}</div> : null}  
                          </div>
                        }
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                          Contact No.
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="tel"
                            name="contactNo"
                            id="contactNo"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="6019-11122333"
                            onChange={formik.handleChange}
                            value={formik.values.contactNo}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.contactNo ? <div>{formik.errors.contactNo}</div> : null}  
                          </div>
                        }
                      </div>
                    </div>

                    <div>
                      <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                        Address Line 1
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="addressLine1"
                          name="addressLine1"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-4/6 sm:text-sm border border-gray-300 rounded-md"
                          placeholder=""
                          defaultValue={''}
                          onChange={formik.handleChange}
                          value={formik.values.addressLine1}
                        />
                      </div>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.addressLine1 ? <div>{formik.errors.addressLine1}</div> : null}  
                        </div>
                      }
                    </div>

                    <div>
                      <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                        Address Line 2
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          id="addressLine2"
                          name="addressLine2"
                          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-4/6 sm:text-sm border border-gray-300 rounded-md"
                          placeholder=""
                          defaultValue={''}
                          onChange={formik.handleChange}
                          value={formik.values.addressLine2}
                        />
                      </div>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.addressLine2 ? <div>{formik.errors.addressLine2}</div> : null}  
                        </div>
                      }
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="job" className="block text-sm font-medium text-gray-700">
                        Job
                      </label>
                      <select
                        id="job"
                        name="job"
                        autoComplete="job-title"
                        className="mt-1 block w-3/6 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={formik.handleChange}
                        value={formik.values.job}
                      >
                        <option value={''}>{'--- Please select ---'}</option>
                        {
                          jobs.map(({ id, title }) => <option key={id} value={id}>{title}</option>)
                        }
                      </select>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.job ? <div>{formik.errors.job}</div> : null}  
                        </div>
                      }
                    </div>
                    
                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="noOfYearExp" className="block text-sm font-medium text-gray-700">
                          Number of year's experiences
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="number"
                            name="noOfYearExp"
                            id="noOfYearExp"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-3/6 rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="3 years"
                            min={0}
                            onChange={formik.handleChange}
                            value={formik.values.noOfYearExp}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.noOfYearExp ? <div>{formik.errors.noOfYearExp}</div> : null}  
                          </div>
                        }
                      </div>
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="prefferedLocation" className="block text-sm font-medium text-gray-700">
                        Preferred Location
                      </label>
                      <select
                        id="prefferedLocation"
                        name="prefferedLocation"
                        className="mt-1 block w-3/6 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={formik.handleChange}
                        value={formik.values.prefferedLocation}
                      >
                        <option value={''}>{'--- Please select ---'}</option>
                        {
                          locations.map(({ id, name }) => <option key={id} value={id}>{name}</option>)
                        }
                      </select>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.prefferedLocation ? <div>{formik.errors.prefferedLocation}</div> : null}  
                        </div>
                      }
                    </div>

                    <div className="col-span-6 sm:col-span-3">
                      <label htmlFor="heardFrom" className="block text-sm font-medium text-gray-700">
                        Where did you hear about the vacancy?
                      </label>
                      <select
                        id="heardFrom"
                        name="heardFrom"
                        autoComplete="heardFrom-title"
                        className="mt-1 block w-3/6 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={formik.handleChange}
                        value={formik.values.heardFrom}
                      >
                        <option value={''}>{'--- Please select ---'}</option>
                        {
                          heardFroms.map(({ key, name }) => <option key={key} value={key}>{name}</option>)
                        }
                      </select>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.heardFrom ? <div>{formik.errors.heardFrom}</div> : null}  
                        </div>
                      }
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div className="col-span-3 sm:col-span-2">
                        <label htmlFor="noticePeriod" className="block text-sm font-medium text-gray-700">
                          Notice Period in your current role
                        </label>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <input
                            type="number"
                            name="noticePeriod"
                            id="noticePeriod"
                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                            placeholder="1 months"
                            min={1}
                            onChange={formik.handleChange}
                            value={formik.values.noticePeriod}
                          />
                        </div>
                        {
                          <div className="mb-3 text-xs text-red-500">
                            {formik.errors.noticePeriod ? <div>{formik.errors.noticePeriod}</div> : null}  
                          </div>
                        }
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Resume</label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                        <div className="space-y-1 text-center">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="flex text-sm text-gray-600">
                            <label
                              htmlFor="file"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                            >
                              <FileUploader 
                                handleChange={handleFileChange}
                                name="file"
                                types={["PDF"]}
                                maxSize={10}
                                label={`Upload or drop your resume here.`}
                              />
                            </label>
                          </div>
                          {
                            (previewFile != null && previewFileName != null && !formik.errors.file) && 
                              <a href={`${previewFile}`}>
                                <p className='text-sm text-blue-700 no-underline hover:underline'>{previewFileName}</p>
                              </a>
                          }
                        </div>
                      </div>
                      {
                        <div className="mb-3 text-xs text-red-500">
                          {formik.errors.file ? <div>{formik.errors.file}</div> : null}
                        </div>
                      }
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                    <button
                      type="submit"
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

export default App;
