<?php 

class Reps extends CI_Controller{

	function index(){

		$this->load->view('header');
		$this->load->view('index');
		$this->load->view('footer');
	}

	function all(){

		$records = $this->rep->all();

		$data['json'] = json_encode($records);

		$this->load->view('json/data', $data);
	}
}