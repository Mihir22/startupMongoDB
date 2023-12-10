let express = require("express");
let router = express.Router();

const myDB = require("../db/mongoDB.js");

/* GET home page. */
router.get("/", async function (req, res) {

  try {

    const startup = await myDB.getStartup();
  
  
    // render the _index_ template with the fires attrib as the list of fires
    res.render("index", { startup: startup, err: null, type: "success" });
  } catch (exception) {
    res.render("index", { startup: [], err: `Error executing SQL ${exception}`,
    type: "danger",});
  }

 
});

/* GET fire details. */
router.get("/startup/:startupID", async function (req, res) {
  
  try {
    const startupID = req.params.startupID;


  const startup = await myDB.getStartupByID(startupID);


  res.render("startupDetails", {startup: startup,err: null,
  type: "success"});
  } catch (exception) {
    res.render("startupDetails", {startup: startup,err: `Error executing SQL ${exception}`,
  type: "danger"});
  }

  
});

/* POST create fires. */
router.get("/create", async function (req, res) {

  res.render("startupCreate", {err: null, type: "success"});
  
});

/* POST create fires. */
router.post("/startup/create", async function (req, res) {

  const startup = req.body;

  

  await myDB.createStartup(startup);


  res.redirect("/");
});

/* POST create fires. */
router.post("/startup/delete/:id", async function (req, res) {
 
  const startup = req.params.id;
  console.log(startup);


  await myDB.deleteStartup(startup);

  res.redirect("/");
});

/*Update the startup data */
router.post("/startup/update/", async function (req, res) {
 
  const body = req.body;


  await myDB.updateStartup(body);


  res.redirect("/startup/"+body.startupID);
  
});


router.post("/investor/delete/:id", async function (req, res) {
 
  const investor = req.params.id;

  console.log("this is id",investor);

  await myDB.deleteInvestor(investor);

  res.redirect("/investors");
});

router.post("/investor/inst/create", async function (req, res) {
 
  const investor = req.body;

  await myDB.createInstInvestor(investor);


  res.redirect("/investors");
});

router.post("/investor/indi/create", async function (req, res) {
 
  const investor = req.body;

  await myDB.createIndiInvestor(investor);


  res.redirect("/investors");
});


router.get("/investor/inst/:investorID", async function (req, res) {
  
try {

  const investorID = req.params.investorID;


  const investorData = await myDB.getInstInvestorByID(investorID);


  res.render("institutionalInvestorDetails", {investor: investorData, err: null,
  type: "success"});

} catch (exception) {
  res.render("institutionalInvestorDetails", {investor: [],err: `Error executing SQL ${exception}`,
  type: "danger" });
}
 
});


/* Get Investor Page */

router.get("/investors", async function (req, res) {
  console.log("Got request for /");

  try {

    const instInvestor = await myDB.getInstInvestors();
    const indiInvestor = await myDB.getIndiInvestors();

   
  
  
    // render the _index_ template with the fires attrib as the list of fires
    res.render("investors", { instInvestor: instInvestor, indiInvestor: indiInvestor, 
      err: null, type: "success" });
  } catch (exception) {
    res.render("investors", { instInvestor: [], indiInvestor: [], err: `Error executing SQL ${exception}`,
    type: "danger",});
  }

 
});


router.get("/investors/createInst", async function (req, res) {
  
  try {

   
    res.render("createInstInvestor", { err: null, type: "success" });
  } catch (exception) {
    res.render("createInstInvesotr", { err: `Error executing SQL ${exception}`,
    type: "danger",});
  }

});

router.get("/investors/createIndi", async function (req, res) {
  
  try {

   
    res.render("createIndInvestor", { err: null, type: "success" });
  } catch (exception) {
    res.render("createIndInvesotr", { err: `Error executing SQL ${exception}`,
    type: "danger",});
  }

 
});

/*Get the invstitutional investors edit page */

router.post("/investor/inst/update", async function (req, res) {
  
 
    const body = req.body;


  await myDB.updateInstInvestorByID(body);


  res.redirect("/investor/inst/"+body.investorID);
 

});


router.get("/investor/ind/:investorID", async function (req, res) {
  
  try {
  
    const investorID = req.params.investorID;
  
  
    const investorData = await myDB.getIndInvestorByID(investorID);
  
  
    res.render("individualInvestorDetails", {investor: investorData, err: null,
    type: "success"});
  
  } catch (exception) {
    res.render("individualInvestorDetails", {investor: [],err: `Error executing SQL ${exception}`,
    type: "danger" });
  }
   
  });


  router.post("/investor/ind/update", async function (req, res) {
  
 
    const body = req.body;


  await myDB.updateIndInvestorByID(body);


  res.redirect("/investor/ind/"+body.investorID);
 

});

router.get('/investor/invests-in/:id', async function(req, res) {
  const investorID = req.params.id;
  try {
    const investorStartups = await myDB.getInvestorStartups(investorID);
    const allStartups = await myDB.getStartup();

    res.render('investsIn', {
      investorStartups: investorStartups,
      allStartups: allStartups,
      investorID: investorID
    });
  } catch (error) {
    // Handle errors, perhaps render an error page
    console.error(error);
    res.status(500).send('An error occurred');
  }
});


router.get("/investor/investsIn/:id", async function (req, res) {
  
  
  try {
    const id = req.params.id;
    

  const investments = await myDB.getInvestments(id);
  
  const allStartups = await myDB.getStartup();

  

  res.render("investsIn", {id: id,investments: investments,allStartups: allStartups,err: null,
  type: "success"});
  } catch (exception) {
  //   res.render("startupDetails", {startups: startup,err: `Error executing SQL ${exception}`,
  // type: "danger"});
  }

  
});


router.post("/investor/addInvestment/:id", async function (req, res) {
  
 
  const investor_id = req.params.id;
  const startup_id = req.body.startupID;

  console.log(investor_id);
  console.log(startup_id)


await myDB.addInvestments(investor_id, startup_id);


res.redirect("/investor/investsIn/"+investor_id);


});

router.post("/investor/deleteInvestment/:id", async function (req, res) {
  
 
  const investor_id = req.params.id;
  const startup_id = req.body.startupID;

  console.log(investor_id);
  console.log(startup_id)


await myDB.deleteInvestments(investor_id, startup_id);


res.redirect("/investor/investsIn/"+investor_id);


});











module.exports = router;