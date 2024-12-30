import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

export function PasswordResetEmail({
  token,
  expiresTime,
}: {
  token: string;
  expiresTime: Date;
}) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verification Code</Heading>
          <Text style={text}>
            Use the following code to verify your email or change your password
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{token}</Text>
          </Section>
          <Text style={text}>
            This code will expire on <strong>{Math.floor((+expiresTime - Date.now()) / (60 * 60 * 1000))} hours</strong>. If you
            didn&apos;t request this code, please ignore this email.
          </Text>
          <Text style={footer}>
            This is an automated email. Please do not reply.
          </Text>
          <Text style={footer}>&copy; 2023 WebPlus+. All rights reserved.</Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Arial, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "40px 0",
};

const text = {
  color: "#333",
  fontSize: "16px",
  lineHeight: "26px",
  textAlign: "center" as const,
};

const codeContainer = {
  background: "#f4f4f4",
  borderRadius: "4px",
  margin: "16px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const code = {
  color: "#333",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "4px",
  lineHeight: "36px",
  margin: "0",
};

const footer = {
  color: "#898989",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  marginTop: "16px",
};
