/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require("react");

const CompLibrary = require("../../core/CompLibrary.js");

const MarkdownBlock = CompLibrary.MarkdownBlock; /* Used to read markdown */
const Container = CompLibrary.Container;
const GridBlock = CompLibrary.GridBlock;

class HomeSplash extends React.Component {
  render() {
    const { siteConfig, language = "" } = this.props;
    const { baseUrl, docsUrl } = siteConfig;
    const docsPart = `${docsUrl ? `${docsUrl}/` : ""}`;
    const langPart = `${language ? `${language}/` : ""}`;
    const docUrl = doc => `${baseUrl}${docsPart}${langPart}${doc}`;

    const SplashContainer = props => (
      <div className="homeContainer homeSnapshooterContainer">
        <div className="homeSplashFade">
          <div className="wrapper homeWrapper">{props.children}</div>
        </div>
      </div>
    );

    const Logo = props => (
      <div className="logoPosition">
        <div className="section logo">
          <img src={props.img_src} alt="Project Logo" />
        </div>
      </div>
    );

    const ProjectTitle = () => (
      <h2 className="projectTitle">
        {siteConfig.title}
        <small>{siteConfig.tagline}</small>
      </h2>
    );

    const PromoSection = props => (
      <div className="section promoSection">
        <div className="promoRow">
          <div className="pluginRowBlock">{props.children}</div>
        </div>
      </div>
    );

    const Button = props => (
      <div className="pluginWrapper buttonWrapper">
        <a className="button" href={props.href} target={props.target}>
          {props.children}
        </a>
      </div>
    );

    return (
      <SplashContainer>
        <div className="inner">
          <Logo
            img_src={`${baseUrl}img/logo_sl_oss.svg`}
          />
          <ProjectTitle siteConfig={siteConfig} />
          <PromoSection>
            <Button href={docUrl("get-started")}>Get Started</Button>
            <Button href={docUrl("introduction")}>Learn More</Button>
          </PromoSection>
        </div>
      </SplashContainer>
    );
  }
}

class Index extends React.Component {
  render() {
    const { config: siteConfig, language = "" } = this.props;
    const { baseUrl } = siteConfig;

    const Block = props => (
      <Container
        padding={["bottom", "top"]}
        margin={props.margin}
        id={props.id}
        background={props.background}
      >
        <GridBlock
          align={props.align}
          contents={props.children}
          layout={props.layout}
        />
      </Container>
    );

    const FeatureCallout = () => (
      <div
        className="productShowcaseSection paddingBottom"
        style={{ textAlign: "center" }}
      >
        <h1>A framework to simplify your tests</h1>
        <MarkdownBlock>
          Squadron is a helpful framework which enables you to write
          tests against dependent services without any overhead.
          Squadron can provide you isolation in tests through Container Providers
          or support for all other services through Cloud Providers.
        </MarkdownBlock>
      </div>
    );

    const GetStarted = () => (
      <Block layout="fourColumn" background="light" align="left">
        {[
          {
            title: "1. Install:",
            content: `Install the Squadron nuget package for MongoDB (or other supported service) within your test project:

\`\`\`sh
dotnet add package Squadron.Mongo
\`\`\`
`
          },
          {
            title: "2. Access:",
            content: `Inject the MongoResources into your test class constructor:
\`\`\`csharp
public class AccountRepositoryTests
    : IClassFixture<MongoResource>
{
    private readonly MongoResources _mongoResources;

    public AccountRepositoryTests(
        MongoResources mongoResources)
    {
        _mongoResources = mongoResources;
    }
}
\`\`\`
`
          },
          {
            title: "3. Use:",
            content: `In your test use MongoResources to create a database and initialize your repository:
\`\`\`csharp
[Fact]
public void CreateAccount_AccountExists()
{
    // arrange
    var database = mongoResources.CreateDatabase();
    _accountRepository = new AccountRepository(database);
    var account = new Account();

    // act
    var addedAccount = _accountRepository.Add(account);

    // assert
    Snapshot.Match(addedAccount);
}
\`\`\`
`
          },
          {}]}
      </Block>
    );

    return (
      <div>
        <HomeSplash siteConfig={siteConfig} language={language} />
        <div className="mainContainer">
          <FeatureCallout />
          <GetStarted />
        </div>
      </div>
    );
  }
}

module.exports = Index;
