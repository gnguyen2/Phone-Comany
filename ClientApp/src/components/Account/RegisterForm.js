import { Button, Form, Label, FormGroup } from "reactstrap";
import { useForm } from 'react-hook-form'
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Roles } from "./Roles";

export async function CreateUser(credentials, roleType, setRegistrationError) {
  setRegistrationError(null);

  try {
    const response = await fetch('register/CreateUser', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        Username: credentials.Username,
        Password: credentials.Password,
        Email: credentials.Email,
        RoleTypeId: roleType,
      }) 
    }); 

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        setRegistrationError(errorData.error);
        console.log("Error 400 recieved");
        return false;
      } else {
        console.error('Error during registration:', response.statusText);
        return false;
      }
    } else {
      // Handle successful user creation if needed
      const result = response.json();
      console.log('User creation successful');
      return result;
    }
  } catch (error) {
    console.log("Error when creating User: ", error);
    return false;
  }
}

async function CreateCustomer(credentials) {
  try {
    const response = await fetch('register/CreateCustomer', {
      method: 'POST',
      headers: {
      'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        FirstName: credentials.FirstName,
        MiddleInitial: credentials.MiddleInitial ? credentials.MiddleInitial : null,
        LastName: credentials.LastName,
        PhoneNumber: credentials.PhoneNumber ? credentials.PhoneNumber : null,
        Email: credentials.Email,
        UserId: credentials.UserId,
      }) // explicitly state each parameter, both this line and line below work tho >:(
      // body: JSON.stringify( credentials )
    });
    // console.log("response: ", response);
    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json();
        console.log("Error 400 received when creating Customer: " , errorData.errors);
        return false;
      } else {
        console.error('Error during customer creation:', response.statusText);
        return false;
      } 
      
    } else {
      console.log('Customer creation successfull');
      const result = await response.json();
      return result;
    }
  } catch (error) {
    console.log("Error when creating Customer: ", error);
  }
}

// access CustomersArray CustomerArr and add to it when registering, also add to UsersArray -> UserArr as well


export default function RegisterForm({ setAuthentication }) {
  const { register, watch, handleSubmit, formState } = useForm();
  const { errors } = formState
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState(null);

  // const watchConfirmPassword = watch("confirmPassword", ''); // you can supply default value as second argument

  const onSubmit = async (credentials) => {
    
    // create a user, get the created UserId from db/backend
    // add UserId to the credentials object that we pass to CreateCustomer
    const createUserObjId = await CreateUser(credentials, 3, setRegistrationError);
    if (createUserObjId == false) {
      return false;
    }
    credentials.UserId = createUserObjId;

    const authDetails = await CreateCustomer(credentials);
    console.log(authDetails);
    if (authDetails == false) {
      return false;
    }

    setAuthentication({
      // currentUser: authDetails.user,
      // role: Roles[authDetails.user.RoleTypeId],
      currentUser: authDetails.userId,
      role: Roles[authDetails.userRoleTypeId],
      token: authDetails.token
    });
    // console.log("Info below from token=loginUser")
    // console.log(`User: ${token.user}`);
    // console.log(`Role: ${[token.user.RoleType]}`);
    // console.log(`Token: ${token.token}`);
    navigate("/");
  };

  return (
    <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
      <div className="card border-0 shadow rounded-3 my-5">
        <div className="card-body p-4 p-sm-5">
          <h5 className="card-title text-center mb-5 fw-light fs-2">Register</h5>
          <Form noValidate onSubmit={ handleSubmit(onSubmit) } >
            <FormGroup floating className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="FirstName" 
                placeholder="First name"
                {...register("FirstName", {
                  required: {
                    value: true,
                    message: 'First name is required'
                  },
                })}
              />
              <Label htmlFor="FirstName">
                First name<span className="text-danger">*</span>
              </Label>
              <p className="text-danger mt-1">{errors.FirstName?.message}</p>

            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="MiddleInitial" 
                placeholder="Middle initial"
                maxLength="1"
                {...register("MiddleInitial", {
                  maxLength: 1
                })}
              />
              <Label htmlFor="MiddleInitial">
                Middle initial
              </Label>
            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="LastName" 
                placeholder="Last name"
                {...register("LastName", {
                  required: {
                    value: true,
                    message: 'Last name is required'
                  },
                })}
              />
              <Label htmlFor="LastName">
                Last name<span className="text-danger">*</span>
              </Label>
              <p className="text-danger mt-1">{errors.LastName?.message}</p>

            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="PhoneNumber" 
                placeholder="Phone number"
                {...register("PhoneNumber")}
              />
              <Label htmlFor="PhoneNumber">
                Phone Number
              </Label>
            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="email" 
                className="form-control" 
                id="email" 
                placeholder="name@example.com"
                {...register("Email", {
                  required: {
                    value: true,
                    message: 'Email is required'
                  },
                  pattern: {
                    value: /[^\s@]+@[^\s@]+\.[^\s@]+/,
                    message: 'Invalid email format'
                  }
                })}
              />
              <Label htmlFor="email">
                Email address<span className="text-danger">*</span>
              </Label>
              <p className="text-danger mt-1">{errors.Email?.message}</p>

            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="text" 
                className="form-control" 
                id="username" 
                placeholder="username"
                {...register("Username", {
                  required: {
                    value: true,
                    message: 'Username is required'
                  }
                })}
              />
              <Label htmlFor="username">
                Username<span className="text-danger">*</span>
              </Label>
              <p className="text-danger mt-1">{errors.Username?.message}</p>

            </FormGroup>
            <FormGroup floating className="mb-3">
            <input 
              type="password" 
              className="form-control" 
              id="password" 
              placeholder="Password"
              {...register("Password", {
                required: {
                  value: true,
                  message: 'Password is required'
                },
              })}
            />
            <Label htmlFor="password">
              Password<span className="text-danger">*</span>
            </Label>
            <p className="text-danger mt-1">{errors.Password?.message}</p>

            </FormGroup>
            <FormGroup floating className="mb-3">
              <input 
                type="password" 
                className="form-control" 
                id="confirmPassword" 
                placeholder="Password"
                {...register("ConfirmPassword", {
                  required: {
                    value: true,
                    message: 'Confirm password is required'
                  },
                  validate: (val) => {
                    if (watch('Password') !== val) {
                      return "Your passwords do no match";
                    }
                  }
                })}
              />
              <Label htmlFor="confirmPassword">
                Confirm password<span className="text-danger">*</span>
              </Label>
              <p className="text-danger mt-1">{errors.ConfirmPassword?.message}</p>

            </FormGroup>
            <p className="text-left">Already have an account? <Link to="/login">Login</Link></p>
            <p className="text-danger">{registrationError}</p>
            <div className="d-grid">
              <Button className="btn-primary btn-login text-uppercase fw-bold" type="submit" >
                Register
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}