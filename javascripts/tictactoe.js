window.api_key = "54eae287208ddeebc39440f69c9d8729f80cfcb5";
window.xd_path = "http://tictactoe.io/DropioJSClientXDReceiver.html";

// TicTacToe
var TicTacToe = Class.create({
		
	// constructor
	initialize: function(drop,chatPassword) {
		this.drop = drop;
		this.chatPassword = chatPassword;
		this.firstMoveMade = false;
		this.myTurn = true;
		this.gameEnded = true;
		this.myNickname = "";
	},
		
	// start the game and the stream
	start: function() {		
		// draw the board
		this.createBoard();
		
		// observe stream events
		DropioStreamer.observe(DropioStreamer.JOINED_CHAT,this.iJoined.bind(this));
		DropioStreamer.observe(DropioStreamer.LEFT_CHAT,this.iLeft.bind(this));
		DropioStreamer.observe(DropioStreamer.STREAM_DISCONNECTED,this.iLeft.bind(this));
		DropioStreamer.observe(DropioStreamer.USER_JOINED,this.playerJoined.bind(this));
		DropioStreamer.observe(DropioStreamer.USER_LEFT,this.playerLeft.bind(this));
		DropioStreamer.observe(DropioStreamer.RECEIVED_DATA,this.receivedData.bind(this));
		DropioStreamer.observe(DropioStreamer.RECEIVED_MESSAGE,this.receivedMessage.bind(this));

		// start the stream
		DropioStreamer.start(this.drop,this.chatPassword,"http://tictactoe.io/streamer_xdr.html");
	},
	
	createBoard: function() {
		// outer board
		this.board = new Element("div",{"class":"board"});
		
		// put it in the DOM
		$("content").insert({top:this.board});
		
		// create each of the 9 squares
		["top","middle","bottom"].each(function(row) {
			["left","center","right"].each(function(col) {
				// the class and id of the square
				var squareId = row + "_" + col + "_square";
				var squareClass = "square " + row + " " + col;
				
				// create and insert the square
				this.board.insert({bottom: new Element("div",{"class":squareClass,"id":squareId})});
				
				// listen for clicks on the square
				Event.observe(squareId,"click",this.squareClicked.bind(this));
			}.bind(this))
		}.bind(this))
		
		// overlay
		this.overlay = new Element("div", {"class":"overlay"});
		this.board.insert({bottom:this.overlay});
		
		// waiting text
		this.waiting = new Element("div",{"class":"waiting","id":"waiting"});
		this.waiting.innerHTML = "<div>waiting to connect...</div>"
		this.tell = new Element("div", {"class":"tell"});
		this.tell.innerHTML = "(this may take a few moments)";
		this.waiting.insert({bottom:this.tell});
		this.board.insert({bottom: this.waiting});
		
		// oops
		this.oops = new Element("div",{"class":"oops","id":"oops"});
		this.oops.innerHTML = "oops..."
		var oopsText = new Element("div", {"class":"oopsText"});
		oopsText.innerHTML = "you were disconnected! try refreshing...";
		this.oops.insert({bottom:oopsText});
		this.oops.hide();
		this.board.insert({bottom: this.oops});
				
		// new game button
		this.playAgain = new Element("div",{"class":"playAgain","id":"playAgain"});
		this.playAgain.hide();
		this.board.insert({bottom:this.playAgain})
		Event.observe("playAgain","click",this.reset.bind(this));
		
		// chat area
		this.messageBox = new Element("div", {"class":"messageBox"});
		this.enterMessage = new Element("input",{"type":"text","value":"trash talk here then push enter","id":"enterMessage"})
		this.messageDisplay = new Element("div", {"class":"messageDisplay","id":"messageDisplay"})
		this.messageBox.insert({bottom:this.enterMessage});
		this.messageBox.insert({bottom:this.messageDisplay});
		this.messageDisplay.hide();
		this.messageBox.hide();
		this.board.insert({bottom:this.messageBox});
		Event.observe(this.messageBox,"keypress",this.sendMessage.bind(this))
		Event.observe(this.enterMessage,"click", function() { this.enterMessage.value = "" }.bind(this))		
	},
	
	iJoined: function(data) {
		this.myNickname = data.nickname;
	    this.waiting.down().innerHTML = "waiting for challenger..."
	    this.tell.innerHTML = "(tell a friend to come to this url to play you)";
	},
	
	iLeft: function(data) {
		this.overlay.show();
		this.waiting.hide();
		this.oops.show();
	},
	
	playerJoined: function(data) {
		// ignore this if its actually you
		if( data.nickname == this.myNickname ) return; 
		
		this.overlay.hide();
		this.waiting.hide();
		this.messageBox.show();
		
		this.gameEnded = false;
	},
	
	playerLeft: function() {
		this.board.removeClassName("playable");
		this.overlay.show();
		this.waiting.show();
		this.gameEnded = true;
	},
	
	squareClicked: function(e) {
		var square = Event.element(e);

		// this player is always X
		if( (!this.firstMoveMade || this.myTurn) && !this.gameEnded && this.squareEmpty(square) ) {
			this.firstMoveMade = true;
			this.drawAt("X", square);
			this.myTurn = false;
			
			// send stream message about move
			var row = square.className.split(" ")[1];
			var col = square.className.split(" ")[2];
			DropioStreamer.sendData({event:"playerMoved",row:row,col:col})
			
			// check for a win
			this.checkTicTacToe("X");
		}
	},
	
	squareEmpty: function(square) {
		// check for the O or X class name
		return !(square.hasClassName("X") || square.hasClassName("O"));
	},
	
	drawAt: function(which,square) {
		square.addClassName(which);
	},
	
	checkTicTacToe: function(which) {
		// brute force checking of all possible lines
		[
			[".square.top.left",    ".square.top.center",    ".square.top.right"],
			[".square.middle.left", ".square.middle.center", ".square.middle.right"],
			[".square.bottom.left", ".square.bottom.center", ".square.bottom.right"],
			[".square.top.left",    ".square.middle.left",   ".square.bottom.left"],
			[".square.top.center",  ".square.middle.center", ".square.bottom.center"],
			[".square.top.right",   ".square.middle.right",  ".square.bottom.right"],
			[".square.top.left",    ".square.middle.center", ".square.bottom.right"],
			[".square.top.right",   ".square.middle.center", ".square.bottom.left"]
		].each(function(line) {
			if( $$(line[0])[0].hasClassName(which) &&
			    $$(line[1])[0].hasClassName(which) && 
			    $$(line[2])[0].hasClassName(which) ) {
				
				line.each(function(squareCSS) {
					$$(squareCSS)[0].addClassName("win");
				});
				
				this.gameOver();
			}
		}.bind(this));
		
		// check for a draw
		if( !this.gameEnded ) {
			var shouldEndGame = true;
			[".square.top.left",    ".square.top.center",    ".square.top.right",
			 ".square.middle.left", ".square.middle.center", ".square.middle.right",
			 ".square.bottom.left", ".square.bottom.center", ".square.bottom.right"].each(function(squareCSS) {
				if( this.squareEmpty($$(squareCSS)[0])) shouldEndGame = false;
			}.bind(this))
			if( shouldEndGame )
				this.gameOver();
		}
	},
	
	gameOver: function() {
		this.gameEnded = true;
		
		setTimeout(function() {
			this.overlay.show();
			this.playAgain.show();
			this.messageBox.hide();
		}.bind(this), 3000)
	},
	
	reset: function() {
		// actually reset the board
		this.doReset();
		
		// send the reset message
		DropioStreamer.sendData({event:"reset"})
	},
	
	doReset: function() {
		$$(".square").each(function(element) {
			element.removeClassName("X");
			element.removeClassName("O");
			element.removeClassName("win");
		});
		
		this.gameEnded = false;
		this.firstMoveMade = false;
		this.myTurn = false;
		
		this.overlay.hide();
		this.playAgain.hide();
		this.messageBox.show();
	},
	
	receivedData: function(data) {	
		// don't act on messages coming from yourself
		if( data.nickname == this.myNickname ) return;
		
		data = data.data;
		
		// received a playerMoved event
		if( data.event == "playerMoved" ) {
			var row = data.row;
			var col = data.col;
			var square = $$(".square."+row+"."+col)[0];
			if( this.squareEmpty(square) ) {
				this.firstMoveMade = true;

				// the other player is always 'O'
				this.drawAt("O",square);

				this.myTurn = true;

				// check for a win
				this.checkTicTacToe("O");
			}
		}
		
		// received a reset event
		else if( data.event == "reset" ) {
			this.doReset();
		}
	},
	
	sendMessage: function(event) {
		if(event.keyCode == Event.KEY_RETURN) {
			DropioStreamer.sendMessage(this.enterMessage.value)
			this.enterMessage.value = "";
		}
	},
	
	receivedMessage: function(data) {
		this.messageDisplay.update(data.message);
		this.messageDisplay.show();
		if( this.msgTimeout != null ) clearTimeout(this.msgTimeout)
		this.msgTimout = setTimeout(function() { this.messageDisplay.hide() }.bind(this),5000)
	}
	
})