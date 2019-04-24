/**
 *
 *
 * @class Tutorial
 * @extends {GameScene}
 */
class Tutorial extends GameScene {
    constructor() {
        super();
        this.except_component = null;
        this.ErrorText = null;
        this.modcount = 0;
        this.count = 0;




    }
    init() {
        this.layers = [];
        this.layers.push(new Layer());
        this.initScene();
        this.codePanelHint();




    }
    initScene() {
        console.log("init GaneUI Menu");
        this.cp = new CodePanel();
        this.addComponent(this.cp, -1);

        //Instruction Menu Button 
        this.InstructionMenuButton = Button.getButton('Instruction_Menu', 375, 30, 1, 3, 'IM');
        this.InstructionMenuButton.addClickEvent(new NewSceneEvent(new InstructionMenu()));
        var IMHint = new HintEvent('IMHint')
        IMHint.setHintContent('this is instruction menu \n it contain all insturtions game support');
        this.InstructionMenuButton.addLongPressEvent(IMHint);
        this.addComponent(this.InstructionMenuButton, -1);
        //run button
        this.RunButon = Button.getButton('Code_Run', 375, 60, 1, 3, 'Run');
        this.addComponent(this.RunButon, -1);
        this.m = new Memory("Memory", [], 5, 5, 50, 200, false);
        this.m.add(0);
        this.addComponent(this.m, -1);
        this.r = new Register("Register", [], 100, 270, 250, 50, true);
        this.r.init();
        this.addComponent(this.r, -1);
        this.addLayer();
        this.cpu = new CPU();
        this.addComponent(this.cpu, -1);
        this.cpu.setSpeed(2);
        this.interpreter=new Interpreter(this.cpu, this.cp, this.m, this.r);
        this.RunButon.addClickEvent(new RunCodeEvent( this.interpreter));
    }
    codePanelHint() {
        this.cp.instructions = ['Hello ', 'bug'];
        this.except_component = this.cp.getContent(1);
        this.ErrorText = 'you should click second line';

        this.addLayer();
        this.highLight(this.cp);
        var cp_hint = new Dialogue('cp hint');
        cp_hint.appendLine('this is a code panel');
        cp_hint.appendLine('you write your code in here');
        cp_hint.appendLine('now,click second line');
        this.addComponent(cp_hint, -1);


    }

    highLightByID(str) {

        var component = this.getByID(str);
        if (component == null) {
            throw 'fail to high light ' + str
        }



    }
    highLight(component) {
        this.inverseSelect(component);


    }

    /**
     *
     *
     * @param {Component} component
     * @memberof Tutorial
     */
    inverseSelect(component, color) {

        this.addComponent(new TransparentComponent('Left', 0, 0, component.x, GAME.height), -1);
        this.addComponent(new TransparentComponent('Riht', component.x + component.width, 0, GAME.width - (component.x + component.width), GAME.height), -1);
        this.addComponent(new TransparentComponent('Top', component.x, 0, component.width, component.y), -1);
        this.addComponent(new TransparentComponent('Down', component.x, component.y + component.height, component.width, GAME.height - (component.y + component.height)), -1);


    }



    getClickedElement(x, y) {
        console.log('get click');
        var component = this.private_getClickElement(x, y);

        if (component != null) {
            console.log(component);
            if (this.except_component != null) {
                if (this.isClicked(x, y, this.except_component)) {

                    this.count++;
                    console.log(this.count);
                    this.except_component = null;
                    console.log(component);
                    return component;
                } else {
                    alert(this.ErrorText);
                    return null;
                }

            }
            return component;

        }
        return null;



    }
    private_getClickElement(x, y) {
        for (var i = this.layers.length - 1; i >= 0; i--) {
            var component = this.layers[i].getClickedElement(x, y);
            if (component != null) {
                return component;

            }
        }
        return null;
    }

    nextStep() {


        switch (this.count) {

            case 1:
                this.typeCode();

                break;
            case 2:
                this.memoryHit();
                break;
            case 3:
                this.registerHint();
                break;
            case 4:
                this.runFirstCode();
            case 5:
            
        
        break;

    }


}
typeCode() {

    console.log('tpye code');

    this.removeLayer(-1);
    this.addLayer();
    this.highLight(new Component('full', null, 0, 0, 0, 0, false));
    var cp_hint = new Dialogue();
    this.addComponent(cp_hint, -1);
    cp_hint.appendLine("now type to change the\" bug\"");
    cp_hint.appendLine(' to \"world\" and,press enter');

    this.count++;


}
memoryHit() {

    if (this.cp.modcount != this.cp.count) {
        console.log(this.cp.getInstructions()[1]);
        if (this.cp.getInstructions()[1] == "world") {
            console.log(this.cp.getContent(1).getContent());
            this.removeLayer(-1);
            this.addLayer();
            this.highLight(this.m);
            var cp_hint = new Dialogue();
            cp_hint.appendLine("click it to next step ");
            cp_hint.appendLine("this is the memory cell you ");
            this.except_component = this.m;
            cp_hint.x = 250;
            cp_hint.y = 100;
            this.cp.modcount = this.cp.count;
            return;
        }
        else {
            alert('sorry,not correct try again');

            this.count = 0;
            this.cp.modcount = this.cp.count;
            this.removeLayer(-1);
            this.codePanelHint();

            return;
        }


    }



}

registerHint() {
    this.removeLayer(-1);
    this.addLayer();
    this.highLight(this.r);
    var cp_hint = new Dialogue();
    this.ErrorText = 'you should click first register';
    cp_hint.appendLine("this is the rigster cell  ");
    cp_hint.appendLine("click it t0 cell to next step ");
    this.except_component = this.r.content[0];
    cp_hint.x = 250;
    cp_hint.y = 100;
    cp_hint.height = 100;
    this.addComponent(cp_hint, -1);
}
runFirstCode() {
    this.removeLayer(-1);
    this.addLayer();
    var cp_hint = new Dialogue();
    this.cp.instructions = [''];
    this.r.getCellAt(0).setContent(4);
    this.r.getCellAt(1).setContent(5);
    cp_hint.appendLine('now,it time to run your first instruction');
    cp_hint.appendLine('type,\"add t0 t1 t2\"');
    cp_hint.appendLine('click run button');
    
    this.cpu.setLocation(250,200);
    cp_hint.width = 250;
    cp_hint.height =100;
    cp_hint.x = 70;
    cp_hint.y =0;
    this.addComponent(cp_hint, -1);
    this.interpreter.test=new TutorialTest(this.cp,this.r,this.m);


    this.count++;


}



updateFrame() {
    this.nextStep();
    for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].updateLayer();
    }

}

isClicked(x, y, component) {
    if (x >= component.x && x <= component.x + component.width) {
        if (y >= component.y && y <= component.y + component.height) {
            return true;
        }
    }
    return false;
}

}