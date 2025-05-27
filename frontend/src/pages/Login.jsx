import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Shield, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuthStore();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = await login(data);
    if (result.success) {
      toast.success('Login successful!');
    } else {
      toast.error(result.error || 'Login failed');
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
                    <h2 className="fw-bold mb-2">CyberTiba</h2>
                    <p className="text-muted">Sign in to your security dashboard</p>
                  </div>

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="danger" className="py-2">
                      {error}
                    </Alert>
                  )}

                  {/* Login Form */}
                  <Form onSubmit={handleSubmit(onSubmit)}>
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

                    <div className="mb-4">
                      <Form.Label className="fw-semibold">Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          className={`ps-5 pe-5 ${errors.password ? 'is-invalid' : ''}`}
                          {...register('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 6,
                              message: 'Password must be at least 6 characters'
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
                          Signing in...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>

                    <div className="text-center">
                      <span className="text-muted">Don't have an account? </span>
                      <Link to="/register" className="text-decoration-none fw-semibold">
                        Sign up here
                      </Link>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              {/* Demo Credentials */}
              <motion.div 
                className="mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-light border-0">
                  <Card.Body className="p-3">
                    <h6 className="mb-2 text-center">Demo Credentials</h6>
                    <div className="text-center small text-muted">
                      <div>Email: demo@cybertiba.ke</div>
                      <div>Password: demo123</div>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </motion.div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;