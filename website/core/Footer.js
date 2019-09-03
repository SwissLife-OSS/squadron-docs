/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    const docsUrl = this.props.config.docsUrl;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    return `${baseUrl}${docsPart}${langPart}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : "") + doc;
  }

  organizationUrl(doc) {
    const organizationUrl = this.props.config.organizationUrl;
    return organizationUrl + "/" + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <div>
            <h3>Community</h3>
            <a href={this.organizationUrl("cla")}>
              Contributor License Agreements
            </a>
            <a href={this.organizationUrl("coc")}>Code of Conduct</a>
          </div>
        </section>
        <a
          href={this.props.config.organizationUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="fbOpenSource"
        >
          <img
            src={`${this.props.config.baseUrl}img/logo_sl_oss_inverted.svg`}
            alt="Swiss Life OSS"
            height="45"
          />
          <span className="projectTitleInverted">Swiss Life | OSS</span>
        </a>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
