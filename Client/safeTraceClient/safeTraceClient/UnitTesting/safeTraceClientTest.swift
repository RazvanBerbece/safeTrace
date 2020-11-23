//
//  safeTraceClientTest.swift
//  safeTraceClientTests
//
//  Created by Razvan-Antonio Berbece on 23/11/2020.
//

import XCTest

class safeTraceClientTest: XCTestCase {

    override func setUpWithError() throws {
        // Put setup code here. This method is called before the invocation of each test method in the class.
    }

    override func tearDownWithError() throws {
        // Put teardown code here. This method is called after the invocation of each test method in the class.
    }
    
    // Tests whether the client can sign in to the API using default login credentials
    func testDefault_SignIn() {
        let email : String = "default@default.com"
        let pass : String = "default"
        let defaultUID : String = "KQ1FYY2WSwhQQQmNDHJvTcnqi8o1" // will be compared with what the Client returns
        let client = Client()
        client.signIn(email: email, pass: pass) {
            (user) in
            let uid = user.getUID()
            XCTAssertEqual(defaultUID, uid, "UIDs do not match. SignIn failed.")
        }
    }
    
    // Tests whether the client can sign up to the API using default login credentials
    /**
     WARNING : This will fail the second time it is run as the account with the given credentials is already in the database.
              As a solution, the test should always try to delete the account with the given credentials before trying to create it.
    */
    func testDefault_SignUp() {
        let email : String = "defaultUP@default.com"
        let pass : String = "defaultUP"
        var responseUID : String = ""
        let client = Client()
        client.signUp(email: email, pass: pass, owner: false) {
            (user) in
            responseUID = user.getUID()
            XCTAssertNotEqual(responseUID, "", "UID is empty. SignUp failed.")
        }
    }

}
