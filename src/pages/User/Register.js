import React, { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import Field from "../../components/Field";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import LogoImage from "../../assets/images/logo.png";
import { registerApi } from "../../util/ApiUtil";


const Register = () => {
  const formikRef = useRef();
  const [isFetching, setIsFetching] = useState(false);
  useEffect(() => {
    document.title = "Registration Page | Feed App";
  }, []);
  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required("Required"),
    lastName: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    phone: Yup.number().required("Required"),
    emailId: Yup.string().email().required("Required"),
    password: Yup.string()
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      )
      .required("Required"),
  });
  const onFormSubmit = async (values) => {
    if (!isFetching) {
      setIsFetching(true);
      const apiResponse = await registerApi(
        values.username,
        values.password,
        values.emailId,
        values.firstName,
        values.lastName,
        values.phone
      );
      if (apiResponse.status === 1) {
        formikRef.current.setFieldValue(
          "formMessage",
          "Registration successful. Please verify your email to continue."
        );
      } else {
        formikRef.current.setFieldValue("formMessage", apiResponse.payLoad);
      }
      setIsFetching(false);
    }
    console.log(values);
  };
  return (
    <div className="bg-white">
      <div className="flex justify-center h-screen">
        <div className="hidden bg-cover lg:block lg:w-2/3 splash-container">
          <div className="flex items-center h-full px-20 bg-gray-900 bg-opacity-40">
            <div>
              <h2 className="text-4xl font-bold text-white">Welcome,</h2>
              <p className="max-w-xl mt-3 text-gray-300">
                You are just one step away to something amazing!
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center w-full mx-auto lg:w-full mt-20 md:mt-0 px-10 md:px-36">
          <div className="flex-1">
            <div className="text-center">
              <img src={LogoImage} width={120} className="mx-auto mb-2" />
              <h2 className="text-4xl font-bold text-center text-gray-700">
                Create an account
              </h2>
              <p className="mt-3 text-gray-500">Let's get you started!</p>
            </div>
            <div className="mt-8">
              <Formik
                innerRef={formikRef}
                initialValues={{
                  firstName: "",
                  lastName: "",
                  username: "",
                  phone: "",
                  emailId: "",
                  password: "",
                  formMessage: undefined,
                }}
                validationSchema={RegisterSchema}
                onSubmit={onFormSubmit}
              >
                {({ values }) => (
                  <Form>
                    {values.formMessage && (
                      <div>
                        <Badge text={values.formMessage} />
                      </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Field
                          label="First Name"
                          type="text"
                          name="firstName"
                          id="firstName"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Field
                          label="Last Name"
                          type="text"
                          name="lastName"
                          id="lastName"
                          placeholder="Enter your last name"
                        />
                      </div>
                      <div>
                        <Field
                          label="Username"
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Enter your username"
                        />
                      </div>
                      <div>
                        <Field
                          label="Email"
                          type="text"
                          name="emailId"
                          id="emailId"
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <Field
                          label="Password"
                          type="password"
                          name="password"
                          id="password"
                          placeholder="Enter your password"
                        />
                      </div>
                      <div>
                        <Field
                          label="Phone"
                          type="text"
                          name="phone"
                          id="phone"
                          placeholder="Enter your phone"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <Button text="Register" />
                    </div>
                  </Form>
                )}
              </Formik>
              <p className="mt-6 text-sm text-center text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/user/login"
                  className="text-purple-500 focus:outline-none focus:underline hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
