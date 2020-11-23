//
//  Authenticator.swift
//  safeTraceClient
//
//  Created by Razvan-Antonio Berbece on 22/11/2020.
//

import Foundation
import Alamofire
import SwiftyJSON

struct Login: Encodable {
    public let email: String
    public let pass: String
}

struct LocationUploadPacket: Encodable {
    public let uid: String
    public let longitude: Double
    public let latitude: Double
}

class Client {
    
    private var initialURL: String = "http://192.168.120.38:5001"
    private var API_available : Bool = false;
    
    init() {}
    
    public func checkAvailability() {
        AF.request(
            self.initialURL + "/", method: .get).responseJSON { (response) in
                switch response.result {
                case .success:
                    let data = response.data
                    let jsonString = String(data: data!, encoding: .utf8)
                    let jsonData = jsonString!.data(using: .utf8)
                    if let jsonResult = try? JSON(data: jsonData!) {
                        print("Response from API : \(jsonResult["data"]["activity"])")
                        if (jsonResult["data"]["activity"] == "true") {
                            self.API_available = true;
                        }
                    }
                case .failure(let err):
                    print(err)
                }
            }
    }
    
    public func signUp(email: String, pass: String, owner: Bool, callback: @escaping (User) -> Void) {
        AF.request(
            self.initialURL + "/signup",
            method: .post,
            parameters: Login(email: email, pass: pass),
            encoder: JSONParameterEncoder.default).responseJSON { (response) in
                switch response.result {
                case .success:
                    let data = response.data
                    let jsonString = String(data: data!, encoding: .utf8)
                    let jsonData = jsonString!.data(using: .utf8)
                    if let jsonResult = try? JSON(data: jsonData!) {
                        print(jsonResult)
                        let uidString = String(describing: jsonResult["data"]["uid"])
                        let emailString = String(describing: jsonResult["data"]["email"])
                        _ = jsonResult["data"]["locations"][0]
                        let user : User = User(uid: uidString, email: emailString, locations: [])
                        callback(user)
                    }
                case .failure(let err):
                    print(err)
                    let user : User = User(uid: "-1", email: "-1", locations: ["-1"])
                    callback(user)
                }
            }
    }
    
    public func signIn(email: String, pass: String, callback: @escaping (User) -> Void) {
        AF.request(
            self.initialURL + "/signin",
            method: .post,
            parameters: Login(email: email, pass: pass),
            encoder: JSONParameterEncoder.default).responseJSON { (response) in
                switch response.result {
                case .success:
                    let data = response.data
                    let jsonString = String(data: data!, encoding: .utf8)
                    let jsonData = jsonString!.data(using: .utf8)
                    if let jsonResult = try? JSON(data: jsonData!) {
                        print(jsonResult)
                        let uidString = String(describing: jsonResult["data"]["uid"])
                        let emailString = String(describing: jsonResult["data"]["email"])
                        _ = jsonResult["data"]["locations"][0]
                        let user : User = User(uid: uidString, email: emailString, locations: [])
                        callback(user)
                    }
                case .failure(let err):
                    print(err)
                    let user : User = User(uid: "-1", email: "-1", locations: ["-1"])
                    callback(user)
                }
            }
    }
    
    public func uploadLocation(uid: String, location: Location, callback: @escaping (String, String, Bool) -> Void) {
        AF.request(
            self.initialURL + "/savelocation",
            method: .post,
            parameters: LocationUploadPacket(uid: uid, longitude: location.getLongitude(), latitude: location.getLatitude()),
            encoder: JSONParameterEncoder.default).responseJSON { (response) in
                switch response.result {
                case .success:
                    let data = response.data
                    let jsonString = String(data: data!, encoding: .utf8)
                    let jsonData = jsonString!.data(using: .utf8)
                    if let jsonResult = try? JSON(data: jsonData!) {
                        print(jsonResult)
                        callback(String(describing: jsonResult["data"]["counter"]), String(describing: jsonResult["data"]["alert"]), false)
                    }
                case .failure(let err):
                    print(err)
                    callback("0", "-1", true)
                }
            }
    }
    
}
