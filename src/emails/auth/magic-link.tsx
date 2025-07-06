/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Img,
  Section,
  Button,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
  token: string;
}

export const MagicLinkEmail = ({
  email,
  token,
}: WelcomeEmailProps): React.ReactElement => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://placehold.co/150x50/007bff/ffffff?text=Your+Logo"
            alt="Your Company Logo"
            style={logo}
          />
          <Text style={paragraph}>Hi {email},</Text>
          <Text style={paragraph}>
            Welcome to our application! We're thrilled to have you join our
            community.
          </Text>
          <Text style={paragraph}>
            To get started and verify your account, please click the button
            below:
          </Text>
          <Section style={buttonContainer}>
            <Button style={button} href={token}>
              Verify Your Email Token : {token}
              email: {email}
            </Button>
          </Section>
          <Text style={paragraph}>
            If you have any questions, feel free to reply to this email.
          </Text>
          <Text style={signature}>
            Best regards,
            <br />
            The App Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MagicLinkEmail;

const main: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Arial, sans-serif',
};

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '8px',
  border: '1px solid #e0e0e0',
  maxWidth: '600px',
};

const logo: React.CSSProperties = {
  margin: '0 auto',
  marginBottom: '20px',
  display: 'block',
};

const paragraph: React.CSSProperties = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left',
  padding: '0 30px',
};

const buttonContainer: React.CSSProperties = {
  textAlign: 'center',
  padding: '0 30px',
};

const button: React.CSSProperties = {
  backgroundColor: '#007bff',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center',
  display: 'inline-block',
  padding: '10px 20px',
};

const signature: React.CSSProperties = {
  color: '#919191',
  fontSize: '14px',
  lineHeight: '20px',
  padding: '0 30px',
  marginTop: '20px',
};
