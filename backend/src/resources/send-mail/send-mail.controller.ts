import { env } from "../../env";
import { Logger, ScopedLogger } from "../../logger";
import { TRPCStatus, getFrontendUrl, getTRPCError } from "../../utils";
import axios, { AxiosError } from "axios";

export interface SendMail {
  passwordReset: (input: SendMailInput) => Promise<TRPCStatus<string>>;
  confirmAccount: (input: SendMailInput) => Promise<TRPCStatus<string>>;
}

type EmailTemplate = {
  title: string;
  content: string;
  hrefLink: string;
  buttonName: string;
};

type SendMailInput = {
  userId: string;
  email: string;
  subject: string;
};

type EmailBody = {
  from: {
    name: string;
    email: string;
  };
  to: {
    email: string;
  }[];
  subject: string;
  text: string;
  html: string;
  project_id: string;
};

class SendMailScaleway implements SendMail {
  private rememberryUrl = getFrontendUrl();
  private apiKey: string;
  private projectId: string;
  private logger: Logger;

  constructor(apiKey: string, projectId: string) {
    this.apiKey = apiKey;
    this.projectId = projectId;
    this.logger = new ScopedLogger("Send Mail Controller");
  }
  async passwordReset({ userId, email, subject }: SendMailInput) {
    const templateInput: EmailTemplate = {
      title: "Reset your password",
      content:
        "This email was sent to you because someone requested to reset their password. If you did not request this please contact the support. Otherwise continue.",
      hrefLink: this.rememberryUrl + "/password/" + userId,
      buttonName: "Reset Password",
    };
    const body = this.getEmailBody(
      email,
      subject,
      this.emailTemplate(templateInput),
    );

    const [err, res] = await this.sendMail(body);
    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, res] as const;
  }

  async confirmAccount({ userId, email, subject }: SendMailInput) {
    const templateInput: EmailTemplate = {
      title: "Confirm your Account",
      content: "Please confirm your account.",
      hrefLink: this.rememberryUrl + "/confirm/" + userId,
      buttonName: "Confirm Account",
    };
    const body = this.getEmailBody(
      email,
      subject,
      this.emailTemplate(templateInput),
    );

    const [err, res] = await this.sendMail(body);
    if (err) return getTRPCError(this.logger, err.message, err.code);

    return [null, res] as const;
  }

  private async sendMail(body: EmailBody) {
    try {
      await axios.post(
        "https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails",
        body,
        {
          headers: {
            "X-Auth-Token": this.apiKey,
          },
        },
      );
      return [null, "Check your mail."] as const;
    } catch (e) {
      const error = e as AxiosError;

      return getTRPCError(
        this.logger,
        "Could not send email" + error.message,
        "INTERNAL_SERVER_ERROR",
      );
    }
  }

  private getEmailBody(email: string, subject: string, html: string) {
    return {
      from: {
        name: "rememberry",
        email: "noreply@rememberry.app",
      },
      to: [
        {
          email: email,
        },
      ],
      subject: subject,
      text: subject,
      html,
      project_id: this.projectId,
    };
  }

  private emailTemplate = ({
    title,
    content,
    hrefLink,
    buttonName,
  }: EmailTemplate) => `
    <html>
      <head>
      </head>
      <body>
        <table style="width: 100%; height: 100%; border-collapse: collapse; border-spacing: 0; padding: 0; margin: 0;">
          <tr>
            <td style="display: table-cell; vertical-align: middle; background-color: #DDD; border-radius: 1rem; text-align: center;">
              <table style="padding: 1rem; margin: auto; border-radius: 1rem; background-color: #FFF;">
                <tr>
                  <td style="padding: 1rem; text-align: center;">
                    <h1 style="color: black; font-family: Verdana, Geneva, Tahoma, sans-serif;">${title}</h1>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 1rem; text-align: center;">
                    <p style="color: black; font-family: Verdana, Geneva, Tahoma, sans-serif;">${content}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 1rem; text-align: center;">
                    <a href=${hrefLink} style="text-decoration: none; background-color: #1370DD; padding: 1rem; border-radius: 5px; color: white; font-family: Verdana, Geneva, Tahoma, sans-serif;">${buttonName}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export const sendMailScaleway = new SendMailScaleway(
  env.get("SCW_SECRET_KEY"),
  env.get("SCW_PROJECT_ID"),
);
