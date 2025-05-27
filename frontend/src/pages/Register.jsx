import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Shield, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error } = useAuthStore();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch('password', '');

  const onSubmit = async (data) => {
    const result = await registerUser({
      email: data.email,
      username: data.username,
      password: data.password,
      password2: data.password2,
      phone: data.phone || '', // Optional field
    });
    
    if (result.success) {
      toast.success('Registration successful! Please log in.');
      navigate('/login');
    } else {
      toast.error(result.error || 'Registration failed');
    }
  };

  return (
    <div className="auth-container min-vh-100 d-flex align-items-center bg-light">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} xl={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="shadow-lg border-0">
                <Card.Body className="p-5">
                  {/* Logo and Title */}
                  <div className="text-center mb-4">
                    <div className="mb-3">
                      <Shield className="text-primary" size={48} />
                    </div>
                    <h2 className="fw-bold mb-2">Join CyberTiba</h2>
                    <p className="text-muted">Create your security dashboard account</p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" className="py-2">
                      {error}
                    </Alert>
                  )}

                  {/* Register Form */}
                  <Form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Username</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="text"
                          placeholder="Enter your username"
                          className={`ps-5 ${errors.username ? 'is-invalid' : ''}`}
                          {...register('username', {
                            required: 'Username is required',
                            minLength: {
                              value: 3,
                              message: 'Username must be at least 3 characters'
                            }
                          })}
                        />
                        <User 
                          className="position-absolute text-muted" 
                          size={18}
                          style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        {errors.username && (
                          <div className="invalid-feedback">
                            {errors.username.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Email Address</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
                          className={`ps-5 ${errors.email ? 'is-invalid' : ''}`}
                          {...register('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^\S+@\S+$/i,
                              message: 'Invalid email address'
                            }
                          })}
                        />
                        <Mail 
                          className="position-absolute text-muted" 
                          size={18}
                          style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        {errors.email && (
                          <div className="invalid-feedback">
                            {errors.email.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Phone (Optional)</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type="tel"
                          placeholder="Enter your phone number"
                          className={`ps-5 ${errors.phone ? 'is-invalid' : ''}`}
                          {...register('phone', {
                            pattern: {
                              value: /^[\+]?[1-9][\d]{0,15}$/,
                              message: 'Invalid phone number'
                            }
                          })}
                        />
                        <Phone 
                          className="position-absolute text-muted" 
                          size={18}
                          style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        {errors.phone && (
                          <div className="invalid-feedback">
                            {errors.phone.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className={`ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters'
                            }
                          })}
                        />
                        <Lock 
                          className="position-absolute text-muted" 
                          size={18}
                          style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <button
                          type="button"
                          className="btn p-0 position-absolute border-0 bg-transparent"
                          style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="text-muted" size={18} />
                          ) : (
                            <Eye className="text-muted" size={18} />
                          )}
                        </button>
                        {errors.password && (
                          <div className="invalid-feedback">
                            {errors.password.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mb-4">
                      <Form.Label className="fw-semibold">Confirm Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showConfirmPassword ? 'text' : 'password'}
                          placeholder="Confirm your password"
                          className={`ps-5 pe-5 ${errors.password2 ? 'is-invalid' : ''}`}
                          {...register('password2', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'Passwords do not match'
                          })}
                        />
                        <Lock 
                          className="position-absolute text-muted" 
                          size={18}
                          style={{ left: '12px', top: '50%', transform: 'translateY(-50%)' }}
                        />
                        <button
                          type="button"
                          className="btn p-0 position-absolute border-0 bg-transparent"
                          style={{ right: '12px', top: '50%', transform: 'translateY(-50%)' }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="text-muted" size={18} />
                          ) : (
                            <Eye className="text-muted" size={18} />
                          )}
                        </button>
                        {errors.password2 && (
                          <div className="invalid-feedback">
                            {errors.password2.message}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-100 mb-3"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Creating account...
                        </>
                      ) : (
                        'Create Account'
                      )}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">Already have an account? </span>
                      <Link to="/login" className="text-decoration-none fw-semibold">
                        Sign in here
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Register;