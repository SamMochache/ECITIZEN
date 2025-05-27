import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { authAPI } from '../services/api'; // Make sure your API service has a register function

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch('password', '');

  const mutation = useMutation(authAPI.register, {
    onSuccess: () => {
      toast.success('Registration successful! Please log in.');
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Registration failed.');
    }
  });

  const onSubmit = (data) => {
    mutation.mutate({
      username: data.username,
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Card className="mx-auto" style={{ maxWidth: '400px' }}>
      <Card.Body>
        <h3 className="mb-4">Register</h3>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="username">
            <Form.Label>Username</Form.Label>
            <Form.Control 
              type="text" 
              placeholder="Enter username"
              {...register('username', { required: 'Username is required', minLength: 3 })}
              isInvalid={errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username && errors.username.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="Enter email"
              {...register('email', { 
                required: 'Email is required', 
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              isInvalid={errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email && errors.email.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Password"
              {...register('password', { 
                required: 'Password is required', 
                minLength: { value: 6, message: 'Minimum 6 characters' }
              })}
              isInvalid={errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password && errors.password.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="password_confirm">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="Confirm Password"
              {...register('password_confirm', { 
                required: 'Please confirm password',
                validate: value => value === password || 'Passwords do not match'
              })}
              isInvalid={errors.password_confirm}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password_confirm && errors.password_confirm.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={mutation.isLoading} className="w-100">
            {mutation.isLoading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default Register;
