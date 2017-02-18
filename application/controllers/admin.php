<?php 

class Admin extends CI_Controller{

	function __construct(){

		parent::__construct();

		if( !$this->session->userdata('logged_in') ) redirect('users');
	}

	function index(){

		//get admin options
		$options = $this->option->get();

		$data = array();

		$data['options'] = $options;

		$this->load->view('admin/header');
		$this->load->view('admin/index', $data);
		$this->load->view('admin/footer');
	}

	function save(){

		$save = $this->input->post('save', TRUE);

		if($save){

			$record = $this->rep->save();

			$data['json'] = json_encode($record);
		}
		else{

			$id = $this->input->post('id', TRUE);

			$record = $this->rep->update($id);

			$data['json'] = json_encode($record);
		}

		$this->load->view('json/data', $data);
	}

	function delete(){

		$id = $this->input->post('id', TRUE);
		
		$this->rep->delete($id);

		$data['json'] = json_encode( array('success' => true) );

		$this->load->view('json/data', $data);	
	}

	function all(){

		$records = $this->rep->all();

		$data['json'] = json_encode($records);

		$this->load->view('json/data', $data);
	}

	function geolocator(){

		//get admin options
		$options = $this->option->get();

		//if tags supported, get tags
		if( $options->tags ){

			$tags = $this->tag->all();
		}

		//create data
		$data = array();

		$data['options'] = $options;
		$data['tags']	 = $tags;

		//load view
		$this->load->view('admin/geolocator', $data);
	}

	function groups(){

		//get admin options
		$options = $this->option->get();

		//if groups aren't enabled, return to admin
		if( !$options->groups ) redirect('admin');

		$data = array();

		$data['groups'] = $this->group->all();

		$this->load->view('admin/groups', $data);
	}

	function tags(){

		//get admin options
		$options = $this->option->get();

		//if tags aren't enabled, return to admin
		if( !$options->tags ) redirect('admin');

		$data = array();

		$data['tags'] = $this->tag->all();

		$this->load->view('admin/tags', $data);
	}

	function settings(){

		$this->load->view('admin/settings');
	}
}